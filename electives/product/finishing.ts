import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { FullScreenQuad, Pass } from 'three/addons/postprocessing/Pass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { CopyShader } from 'three/addons/shaders/CopyShader.js';

// The stage's native finishing chain, standing in for WebGi's: render → ambient occlusion →
// progressive accumulation (with HDR clamped at 8, as WebGi's RGBM buffers do) → bloom → tone
// mapping, contrast and saturation → sRGB. Pixels with alpha 0 (the white background and the
// reference ground) skip tone mapping, as WebGi's do.

// GTAO, with two WebGi habits: the transmissive crystal is left out of the depth (so the dial
// underneath receives the occlusion), and occlusion darkens only tone-mapped pixels (alpha 1, the
// product). The ground still occludes the strap above it but receives none itself (WebGi's
// ground has SSAO disabled; its contact shadow does that job).
export class ProductAOPass extends Pass {
  readonly gtao: GTAOPass;
  readonly skip = new Set<THREE.Object3D>(); // extra objects to leave out of the occlusion depth
  blendIntensity = 1;
  private readonly scene: THREE.Scene;
  private readonly blend = new THREE.ShaderMaterial({
    name: 'ProductAOBlend',
    uniforms: {tDiffuse: {value: null}, tAO: {value: null}, intensity: {value: 1}},
    vertexShader: CopyShader.vertexShader,
    fragmentShader: `uniform sampler2D tDiffuse; uniform sampler2D tAO; uniform float intensity; varying vec2 vUv;
      void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        float ao = mix(1.0, texture2D(tAO, vUv).r, intensity * clamp(color.a, 0.0, 1.0));
        gl_FragColor = vec4(color.rgb * ao, color.a);
      }`,
    depthTest: false, depthWrite: false, blending: THREE.NoBlending,
  });
  private readonly quad = new FullScreenQuad(this.blend);
  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    super();
    this.scene = scene;
    this.gtao = new GTAOPass(scene, camera, 1, 1);
    this.gtao.output = GTAOPass.OUTPUT.Off; // compute the occlusion only; this pass applies it
    this.needsSwap = true;
  }
  setSize(width: number, height: number) { this.gtao.setSize(width, height); }
  render(renderer: THREE.WebGLRenderer, writeBuffer: THREE.WebGLRenderTarget, readBuffer: THREE.WebGLRenderTarget, delta: number, maskActive: boolean) {
    const hidden: THREE.Object3D[] = [];
    this.scene.traverseVisible(object => {
      if (this.skip.has(object)) hidden.push(object);
      else if (object instanceof THREE.Mesh) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        if (materials.some(m => (m as THREE.MeshPhysicalMaterial).transmission > 0)) hidden.push(object);
      }
    });
    for (const object of hidden) object.visible = false;
    try { this.gtao.render(renderer, writeBuffer, readBuffer, delta, maskActive); }
    finally { for (const object of hidden) object.visible = true; }
    this.blend.uniforms.tDiffuse.value = readBuffer.texture;
    this.blend.uniforms.tAO.value = this.gtao.pdRenderTarget.texture;
    this.blend.uniforms.intensity.value = this.blendIntensity;
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    this.quad.render(renderer);
  }
  dispose() { this.gtao.dispose(); this.blend.dispose(); this.quad.dispose(); }
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
      gl_FragColor = vec4( clamp( mix( hdr, gl_FragColor.rgb, mapped ), 0.0, 1.0 ), 1.0 );
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
  render: RenderPass;
  ao: ProductAOPass;
  accumulate: AccumulatePass;
  bloom: UnrealBloomPass;
  output: FinishPass;
  setSize(width: number, height: number, pixelRatio: number): void;
  // Copies the last finished frame to the canvas: a converged still costs one copy per frame.
  present(): void;
  dispose(): void;
}

export function createFinishing(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera): Finishing {
  const target = new THREE.WebGLRenderTarget(1, 1, {type: THREE.HalfFloatType, samples: Math.min(4, renderer.capabilities.maxSamples)});
  const composer = new EffectComposer(renderer, target);
  // The background is white and skips tone mapping; the scene draws over it without a clear.
  const backdrop = new BackdropPass();
  const render = new RenderPass(scene, camera);
  render.clear = false;
  const ao = new ProductAOPass(scene, camera);
  // WebGi's SSAO radius is 1 of its world units; the stage rescales it to stage units.
  ao.gtao.updateGtaoMaterial({radius: 1, distanceExponent: 1, thickness: 1, scale: 1, samples: 16});
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
  for (const pass of [backdrop, render, ao, accumulate, bloom, output]) composer.addPass(pass);
  // The finished frame stays in the composer's read buffer; present() copies it to the canvas.
  composer.renderToScreen = false;
  const copy = new THREE.ShaderMaterial({...CopyShader, uniforms: THREE.UniformsUtils.clone(CopyShader.uniforms), depthTest: false, depthWrite: false, blending: THREE.NoBlending});
  const quad = new FullScreenQuad(copy);
  let key = '';
  return {
    composer, backdrop, render, ao, accumulate, bloom, output,
    setSize(width, height, pixelRatio) {
      const next = `${width}:${height}:${pixelRatio}`;
      if (next === key) return;
      key = next;
      composer.setPixelRatio(pixelRatio);
      composer.setSize(width, height);
    },
    present() {
      copy.uniforms.tDiffuse.value = composer.readBuffer.texture;
      renderer.setRenderTarget(null);
      quad.render(renderer);
    },
    dispose() {
      for (const pass of [backdrop, ao, accumulate, bloom, output]) pass.dispose();
      copy.dispose(); quad.dispose();
      composer.dispose();
    },
  };
}
