import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { FullScreenQuad, Pass } from 'three/addons/postprocessing/Pass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { CopyShader } from 'three/addons/shaders/CopyShader.js';

// The stage's native finishing chain, standing in for WebGi's: ambient occlusion (computed first,
// applied inside the product's materials) → render → progressive accumulation (with HDR clamped
// at 8, as WebGi's RGBM buffers do) → bloom → tone mapping, contrast and saturation → sRGB. Pixels
// with alpha 0 (the white background and the reference ground) skip tone mapping, as WebGi's do.

const isTransmissive = (material: THREE.Material) => (material as THREE.MeshPhysicalMaterial).transmission > 0;
const materialsOf = (mesh: THREE.Mesh) => Array.isArray(mesh.material) ? mesh.material : [mesh.material];

// Screen-space ambient occlusion the way WebGi applies it: computed before the scene is drawn,
// then read by the product's own materials, where it darkens only environment (indirect) light,
// exactly as an aoMap does. Direct light from light_0 is untouched. GTAO computes the occlusion,
// with the transmissive crystal left out of its depth (so the dial underneath receives it). The
// ground still occludes the strap above it but receives none itself (WebGi's ground has SSAO
// disabled; its contact shadow does that job), and neither does the crystal.
export class ProductAOPass extends Pass {
  readonly gtao: GTAOPass;
  readonly skip = new Set<THREE.Object3D>(); // extra objects to leave out of the occlusion depth
  readonly exclude = new Set<THREE.Material>(); // materials that never receive it (the ground)
  // An exponent on GTAO's result: 0 none, 1 GTAO as computed, above 1 darker. WebGi's SSAO
  // intensity (0.25) is on its own algorithm's scale, so this value was chosen by measuring the
  // stage against the WebGi captures (VALIDATION.md), not copied.
  intensity = 2;
  // Shared by every patched material. Intensity stays 0 except while the main scene pass draws,
  // so the floor mirror, shadow maps, and an unfinished frame never read a stale screen image.
  readonly uniforms = {productAOMap: {value: null as THREE.Texture | null}, productAOIntensity: {value: 0}, productAOSize: {value: new THREE.Vector2(1, 1)}};
  private readonly patched = new WeakSet<THREE.Material>();
  private readonly scene: THREE.Scene;
  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    super();
    this.scene = scene;
    this.gtao = new GTAOPass(scene, camera, 1, 1);
    this.gtao.output = GTAOPass.OUTPUT.Off; // compute only; the materials read the result
    this.needsSwap = false;
  }
  setSize(width: number, height: number) { this.gtao.setSize(width, height); this.uniforms.productAOSize.value.set(width, height); }
  render(renderer: THREE.WebGLRenderer, writeBuffer: THREE.WebGLRenderTarget, readBuffer: THREE.WebGLRenderTarget, delta: number, maskActive: boolean) {
    const hidden: THREE.Object3D[] = [];
    this.scene.traverseVisible(object => {
      if (this.skip.has(object)) hidden.push(object);
      else if (object instanceof THREE.Mesh) {
        const materials = materialsOf(object);
        if (materials.some(isTransmissive)) hidden.push(object);
        else for (const material of materials) this.patch(material);
      }
    });
    for (const object of hidden) object.visible = false;
    try { this.gtao.render(renderer, writeBuffer, readBuffer, delta, maskActive); }
    finally { for (const object of hidden) object.visible = true; }
    this.uniforms.productAOMap.value = this.gtao.pdRenderTarget.texture;
  }
  // Adds the screen-space occlusion to a lit material (once), keeping any shader change it has.
  private patch(material: THREE.Material) {
    if (this.patched.has(material) || this.exclude.has(material) || !(material instanceof THREE.MeshStandardMaterial)) return;
    this.patched.add(material);
    const previous = material.onBeforeCompile, previousKey = material.customProgramCacheKey;
    const uniforms = this.uniforms;
    material.onBeforeCompile = (shader, renderer) => {
      previous.call(material, shader, renderer);
      Object.assign(shader.uniforms, uniforms);
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform sampler2D productAOMap;\nuniform float productAOIntensity;\nuniform vec2 productAOSize;')
        .replace('#include <aomap_fragment>', `#include <aomap_fragment>
if ( productAOIntensity > 0.0 ) {
  float productAO = pow( texture2D( productAOMap, gl_FragCoord.xy / productAOSize ).r, productAOIntensity );
  reflectedLight.indirectDiffuse *= productAO;
  #if defined( USE_ENVMAP ) && defined( STANDARD )
    reflectedLight.indirectSpecular *= computeSpecularOcclusion( saturate( dot( geometryNormal, geometryViewDir ) ), productAO, material.roughness );
  #endif
}`);
    };
    material.customProgramCacheKey = () => `${previousKey.call(material)}|product-screen-ao-v1`;
    material.needsUpdate = true;
  }
  dispose() { this.gtao.dispose(); }
}

// The scene pass, with the screen-space occlusion switched on only while it draws (the crystal's
// transmission pass inside it included, which sees the same screen). It also draws the backdrop
// as the scene's first object, so the picture the crystal looks through (three.js renders it
// separately and would clear it to black) shows the white background, not tone mapped, wherever
// nothing solid is behind the glass. In the main picture it lands on the identical backdrop.
export class ProductRenderPass extends RenderPass {
  private readonly ao: ProductAOPass;
  private readonly backdrop: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, ao: ProductAOPass, color: THREE.Color) {
    super(scene, camera);
    this.ao = ao;
    this.backdrop = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
      name: 'BackdropInScene',
      uniforms: {color: {value: color}},
      vertexShader: 'void main() { gl_Position = vec4(position.xy, 1.0, 1.0); }',
      fragmentShader: 'uniform vec3 color; void main() { gl_FragColor = vec4(color, 0.0); }',
      depthTest: false, depthWrite: false,
    }));
    Object.assign(this.backdrop, {name: 'finishing backdrop', frustumCulled: false, renderOrder: -Infinity, visible: false});
  }
  render(renderer: THREE.WebGLRenderer, writeBuffer: THREE.WebGLRenderTarget, readBuffer: THREE.WebGLRenderTarget, delta: number, maskActive: boolean) {
    const uniforms = this.ao.uniforms;
    uniforms.productAOIntensity.value = this.ao.enabled && uniforms.productAOMap.value ? this.ao.intensity : 0;
    this.scene.add(this.backdrop);
    this.backdrop.visible = true;
    try { super.render(renderer, writeBuffer, readBuffer, delta, maskActive); }
    finally {
      uniforms.productAOIntensity.value = 0;
      this.backdrop.visible = false;
      this.scene.remove(this.backdrop);
    }
  }
  dispose() { this.backdrop.geometry.dispose(); this.backdrop.material.dispose(); }
}

// Fills the frame with the background color at alpha 0 ("do not tone map"). A plain clear can't:
// three premultiplies the clear color by its alpha, so white at alpha 0 clears to black.
export class BackdropPass extends Pass {
  readonly color = new THREE.Color(0xffffff);
  private readonly material = new THREE.ShaderMaterial({
    name: 'BackdropShader',
    uniforms: {color: {value: this.color}},
    vertexShader: CopyShader.vertexShader,
    fragmentShader: 'uniform vec3 color; void main() { gl_FragColor = vec4(color, 0.0); }',
    depthTest: false, depthWrite: false, blending: THREE.NoBlending,
  });
  private readonly quad = new FullScreenQuad(this.material);
  constructor() { super(); this.needsSwap = false; }
  render(renderer: THREE.WebGLRenderer, _writeBuffer: THREE.WebGLRenderTarget, readBuffer: THREE.WebGLRenderTarget) {
    renderer.setRenderTarget(readBuffer);
    renderer.clear(false, true, true);
    this.quad.render(renderer);
  }
  dispose() { this.material.dispose(); this.quad.dispose(); }
}

// Running average of jittered frames. Each new frame is clamped at `clampMax` first. When
// `addSample` is false the pass only re-presents the stored average. The stage stops adding
// samples at `maxSamples` (WebGi's progressive plugin: 32); 1 means a single unjittered frame.
export class AccumulatePass extends Pass {
  addSample = true;
  samples = 0;
  maxSamples = 32;
  clampMax = 8;
  private history: [THREE.WebGLRenderTarget, THREE.WebGLRenderTarget];
  private current = 0;
  private readonly blend: THREE.ShaderMaterial;
  private readonly copy: THREE.ShaderMaterial;
  private readonly quad = new FullScreenQuad();
  constructor() {
    super();
    const make = () => new THREE.WebGLRenderTarget(1, 1, {type: THREE.HalfFloatType, depthBuffer: false});
    this.history = [make(), make()];
    this.blend = new THREE.ShaderMaterial({
      name: 'AccumulateShader',
      uniforms: {tCurrent: {value: null}, tHistory: {value: null}, weight: {value: 1}, clampMax: {value: 8}},
      vertexShader: CopyShader.vertexShader,
      fragmentShader: `uniform sampler2D tCurrent; uniform sampler2D tHistory; uniform float weight; uniform float clampMax; varying vec2 vUv;
        void main() {
          vec4 current = texture2D(tCurrent, vUv);
          current = vec4(min(current.rgb, vec3(clampMax)), clamp(current.a, 0.0, 1.0));
          gl_FragColor = mix(texture2D(tHistory, vUv), current, weight);
        }`,
      depthTest: false, depthWrite: false, blending: THREE.NoBlending,
    });
    this.copy = new THREE.ShaderMaterial({...CopyShader, uniforms: THREE.UniformsUtils.clone(CopyShader.uniforms), depthTest: false, depthWrite: false, blending: THREE.NoBlending});
  }
  setSize(width: number, height: number) {
    for (const target of this.history) target.setSize(width, height);
    this.samples = 0;
  }
  render(renderer: THREE.WebGLRenderer, writeBuffer: THREE.WebGLRenderTarget, readBuffer: THREE.WebGLRenderTarget) {
    if (this.addSample || this.samples === 0) {
      const next = 1 - this.current;
      this.blend.uniforms.tCurrent.value = readBuffer.texture;
      this.blend.uniforms.tHistory.value = this.history[this.current].texture;
      this.blend.uniforms.weight.value = 1 / (this.samples + 1);
      this.blend.uniforms.clampMax.value = this.clampMax;
      renderer.setRenderTarget(this.history[next]);
      this.quad.material = this.blend;
      this.quad.render(renderer);
      this.current = next;
      this.samples++;
    }
    this.copy.uniforms.tDiffuse.value = this.history[this.current].texture;
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    this.quad.material = this.copy;
    this.quad.render(renderer);
  }
  dispose() { for (const target of this.history) target.dispose(); this.blend.dispose(); this.copy.dispose(); this.quad.dispose(); }
}

// OutputPass plus WebGi's tone-map extras: contrast and saturation after the tone-mapping curve,
// in linear light (WebGi: (color − 0.5) × contrast + 0.5). Alpha 0 means "do not tone map".
export class FinishPass extends OutputPass {
  constructor() {
    super();
    Object.assign(this.uniforms, {contrast: {value: 1.1}, saturation: {value: 1}, honorMask: {value: 1}});
    this.material.fragmentShader = this.material.fragmentShader
      .replace('uniform sampler2D tDiffuse;', 'uniform sampler2D tDiffuse;\nuniform float contrast;\nuniform float saturation;\nuniform float honorMask;')
      .replace('gl_FragColor = texture2D( tDiffuse, vUv );', 'gl_FragColor = texture2D( tDiffuse, vUv );\nvec3 hdr = gl_FragColor.rgb;\nfloat mapped = mix(1.0, clamp(gl_FragColor.a, 0.0, 1.0), honorMask);')
      .replace('// color space', `#if defined( LINEAR_TONE_MAPPING ) || defined( REINHARD_TONE_MAPPING ) || defined( CINEON_TONE_MAPPING ) || defined( ACES_FILMIC_TONE_MAPPING ) || defined( AGX_TONE_MAPPING ) || defined( NEUTRAL_TONE_MAPPING ) || defined( CUSTOM_TONE_MAPPING )
        gl_FragColor.rgb = ( gl_FragColor.rgb - 0.5 ) * contrast + 0.5;
        gl_FragColor.rgb = mix( vec3( dot( gl_FragColor.rgb, vec3( 0.2125, 0.7154, 0.0721 ) ) ), gl_FragColor.rgb, saturation );
      #endif
      // At the product's outline a pixel mixes product (alpha 1) and background or floor (alpha 0).
      // The untone-mapped share stands for display-ready surroundings, so it is capped at white:
      // otherwise the product's HDR light leaks through it and a bright edge clips to pure white.
      gl_FragColor = vec4( clamp( mix( min( hdr, vec3( 1.0 ) ), gl_FragColor.rgb, mapped ), 0.0, 1.0 ), 1.0 );
      // color space`);
  }
  get contrast() { return this.uniforms.contrast.value as number; }
  set contrast(value: number) { this.uniforms.contrast.value = value; }
  get saturation() { return this.uniforms.saturation.value as number; }
  set saturation(value: number) { this.uniforms.saturation.value = value; }
}

export function setSoftThreshold(bloom: UnrealBloomPass, softness: number) {
  const uniforms = bloom.materialHighPassFilter.uniforms;
  uniforms.smoothWidth.value = softness; // reused: the knee as a fraction of the threshold
  bloom.materialHighPassFilter.fragmentShader = `uniform sampler2D tDiffuse; uniform float luminosityThreshold; uniform float smoothWidth; varying vec2 vUv;
    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      float brightness = max(texel.r, max(texel.g, texel.b));
      float knee = luminosityThreshold * smoothWidth;
      float soft = clamp(brightness - luminosityThreshold + knee, 0.0, 2.0 * knee);
      soft = soft * soft * 0.125 / (2.0 * knee + 1e-5);
      float contribution = max(soft, brightness - luminosityThreshold) / max(brightness, 1e-3);
      // Only tone-mapped pixels (alpha 1: the product) glow; the background and ground do not.
      gl_FragColor = vec4(texel.rgb * contribution * clamp(texel.a, 0.0, 1.0), 1.0);
    }`;
  bloom.materialHighPassFilter.needsUpdate = true;
}

export interface Finishing {
  composer: EffectComposer;
  backdrop: BackdropPass;
  render: ProductRenderPass;
  ao: ProductAOPass;
  accumulate: AccumulatePass;
  bloom: UnrealBloomPass;
  output: FinishPass;
  // MSAA samples for the scene in a frame's first, unjittered sample (all a moving view shows).
  // The other 31 samples of a still skip MSAA: their sub-pixel jitter already smooths the edges.
  multisample: number;
  setSize(width: number, height: number, pixelRatio: number): void;
  // Runs the chain once. `firstSample` picks the multisampled scene picture.
  draw(firstSample: boolean): void;
  // Copies the last finished frame to the canvas: a converged still costs one copy per frame.
  present(): void;
  dispose(): void;
}

export function createFinishing(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera): Finishing {
  // Two plain targets for the composer's full-screen passes, and a multisampled one the scene
  // draws into on a first sample.
  const target = new THREE.WebGLRenderTarget(1, 1, {type: THREE.HalfFloatType});
  const composer = new EffectComposer(renderer, target);
  const multisampled = target.clone();
  multisampled.samples = Math.min(4, renderer.capabilities.maxSamples);
  // The background is white and skips tone mapping; the scene draws over it without a clear.
  const backdrop = new BackdropPass();
  const ao = new ProductAOPass(scene, camera);
  // WebGi's SSAO radius is 1 of its world units; the stage rescales it to stage units.
  ao.gtao.updateGtaoMaterial({radius: 1, distanceExponent: 1, thickness: 1, scale: 1, samples: 16});
  const render = new ProductRenderPass(scene, camera, ao, backdrop.color);
  render.clear = false;
  const accumulate = new AccumulatePass();
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.06, 0.6, 1.82);
  // WebGi's bright-pass keeps only the light above the threshold (with a soft knee, 0.67);
  // UnrealBloomPass's default passes a pixel's whole value once it crosses, which makes the
  // white floor (about 2 before tone mapping) glow over everything.
  setSoftThreshold(bloom, 0.67);
  // Bloom adds light but must not change alpha, or the white background near a highlight
  // would be tone mapped (ACES turns 1.0 grey).
  Object.assign(bloom.blendMaterial, {blending: THREE.CustomBlending, blendEquation: THREE.AddEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneFactor});
  const output = new FinishPass();
  for (const pass of [backdrop, ao, render, accumulate, bloom, output]) composer.addPass(pass);
  // The finished frame stays in the composer's read buffer; present() copies it to the canvas.
  composer.renderToScreen = false;
  const copy = new THREE.ShaderMaterial({...CopyShader, uniforms: THREE.UniformsUtils.clone(CopyShader.uniforms), depthTest: false, depthWrite: false, blending: THREE.NoBlending});
  const quad = new FullScreenQuad(copy);
  let key = '';
  return {
    composer, backdrop, render, ao, accumulate, bloom, output,
    get multisample() { return multisampled.samples; },
    set multisample(samples: number) {
      if (samples === multisampled.samples) return;
      multisampled.samples = samples;
      multisampled.dispose(); // reallocated at the new sample count on next use
    },
    setSize(width, height, pixelRatio) {
      const next = `${width}:${height}:${pixelRatio}`;
      if (next === key) return;
      key = next;
      composer.setPixelRatio(pixelRatio);
      composer.setSize(width, height);
      multisampled.setSize(composer.renderTarget2.width, composer.renderTarget2.height);
    },
    draw(firstSample) {
      // The scene (and the finished frame) land in the read buffer; renderTarget1 takes the rest.
      composer.readBuffer = firstSample ? multisampled : composer.renderTarget2;
      composer.writeBuffer = composer.renderTarget1;
      composer.render();
    },
    present() {
      copy.uniforms.tDiffuse.value = composer.readBuffer.texture;
      renderer.setRenderTarget(null);
      quad.render(renderer);
    },
    dispose() {
      for (const pass of [backdrop, ao, render, accumulate, bloom, output]) pass.dispose();
      copy.dispose(); quad.dispose();
      composer.dispose(); multisampled.dispose();
    },
  };
}
