// The playground's finishing touches, rebuilt with three.js: the product camera, a baked soft ground
// shadow, and a post-processing chain with bloom, progressive anti-aliasing, and a white background
// that skips tone mapping. The capstone imports these. Every object here holds GPU memory, so each
// has a dispose(); pages call it from onLeave.
import * as THREE from 'three';
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { TAARenderPass } from 'three/addons/postprocessing/TAARenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// The playground's settings, from Spring.glb's WEBGI_viewer extension (see ../README.md).
export const PLAYGROUND = {
  fov: 15,
  maxPolarAngle: Math.PI / 2,
  minDistance: 0.35,
  groundSize: 8,
  shadowFrames: 400,
  progressiveFrames: 32,
  bloom: { threshold: 2, intensity: 0.2, radius: 0.6, iterations: 4 },
};

// UnrealBloomPass settings for the playground's faint glow. The threshold carries over: brightness
// before tone mapping, where 1.0 is white paper. The strength doesn't: UnrealBloomPass multiplies it
// by 3 and always blurs at 5 sizes, so a strength of 0.2 covers the ring in haze. 0.03 was picked by eye.
export const FAINT_BLOOM = { threshold: 2, strength: 0.03, radius: 0.6 };

// A long product-photo lens, and an orbit that stops at the target's height so the camera never
// looks up from under the ground. Keeps the camera's distance to the target.
export function productCamera(camera: THREE.PerspectiveCamera, controls: OrbitControls) {
  camera.fov = PLAYGROUND.fov;
  camera.updateProjectionMatrix();
  controls.maxPolarAngle = PLAYGROUND.maxPolarAngle;
  controls.minDistance = PLAYGROUND.minDistance;
}

// How far back a camera with `fov` has to sit to show a subject the same size as a camera with
// `fromFov` at `fromDistance`.
export function sameFramingDistance(fromFov: number, fromDistance: number, fov: number) {
  const halfAngle = (degrees: number) => THREE.MathUtils.degToRad(degrees) / 2;
  return (fromDistance * Math.tan(halfAngle(fromFov))) / Math.tan(halfAngle(fov));
}

// ---- The baked soft ground shadow ----

export interface GroundShadow {
  /** The ground to add to the scene: see-through except for the shadow, which darkens what's behind it. */
  ground: THREE.Mesh;
  /** How many light directions are in the average so far. */
  readonly framesBaked: number;
  readonly done: boolean;
  /** Bakes up to `count` more light directions. Call it from the frame loop until `done`. */
  step(count?: number): void;
  dispose(): void;
}

interface GroundShadowOptions {
  size?: number; // the ground's width, centered under the model
  resolution?: number; // the shadow texture's width and height, in texels
  frames?: number; // how many light directions to average
  spread?: number; // 0 is one light straight overhead (a hard shadow); 1 tilts up to 45° off overhead
  darkness?: number; // the ground's opacity where every light direction is blocked
}

// A soft shadow under `model`, made the way a shadow baker works: shine one shadow-casting light from
// many random directions above, one direction per frame, and keep a running average of where the
// ground was in shadow. Where a part touches the ground, every direction is blocked, so the shadow
// is darkest there; further out, only some are, so it fades. The average lives in a texture on the
// ground, so once every direction is in, it costs nothing more until the model moves.
// The model must be in the scene (or have its world matrix up to date) when this is called.
export function bakedGroundShadow(
  renderer: THREE.WebGLRenderer,
  model: THREE.Object3D,
  { size = PLAYGROUND.groundSize, resolution = 1024, frames = PLAYGROUND.shadowFrames, spread = 1, darkness = 0.9 }: GroundShadowOptions = {},
): GroundShadow {
  model.updateWorldMatrix(true, true);
  const box = new THREE.Box3().setFromObject(model, true);
  const center = box.getCenter(new THREE.Vector3()).setY(box.min.y); // the ground sits under the model
  const height = box.max.y - box.min.y;

  // A scene of its own for the bake: a copy of the model that only casts (it shares the model's
  // geometry, so no new GPU memory), a ground that only shows shadow, and the light.
  const bake = new THREE.Scene();
  const castOnly = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, side: THREE.DoubleSide });
  const caster = model.clone(true);
  model.matrixWorld.decompose(caster.position, caster.quaternion, caster.scale);
  caster.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.material = castOnly; // draws nothing in the picture, but still goes into the shadow map
    child.castShadow = true;
  });
  const plane = new THREE.PlaneGeometry(size, size).rotateX(-Math.PI / 2);
  const shadowCatcher = new THREE.ShadowMaterial({ opacity: 1 }); // alpha = how shadowed
  const bakeGround = new THREE.Mesh(plane, shadowCatcher);
  bakeGround.position.copy(center);
  bakeGround.receiveShadow = true;

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  const shadowCamera = light.shadow.camera;
  shadowCamera.left = shadowCamera.bottom = -size / 2;
  shadowCamera.right = shadowCamera.top = size / 2;
  shadowCamera.near = 0.1;
  shadowCamera.far = size * 2 + height;
  light.target.position.copy(center);
  bake.add(caster, bakeGround, light, light.target);

  // Looks straight down at the ground, so the picture it takes lines up with the ground's UVs:
  // +X to the right, −Z up. It sees only a thin slab around the ground, so most of the cast-only
  // copy is culled instead of drawn for nothing.
  const top = new THREE.OrthographicCamera(-size / 2, size / 2, size / 2, -size / 2, 99.9, 100.1);
  top.up.set(0, 0, -1);
  top.position.copy(center).add(new THREE.Vector3(0, 100, 0));
  top.lookAt(center);

  const sample = new THREE.WebGLRenderTarget(resolution, resolution, { type: THREE.HalfFloatType });
  const average = new THREE.WebGLRenderTarget(resolution, resolution, {
    type: THREE.HalfFloatType,
    depthBuffer: false,
    generateMipmaps: true, // the ground is seen at a slant, so it needs smaller copies
    minFilter: THREE.LinearMipmapLinearFilter,
  });

  // Blends each new picture in with weight 1/n, which keeps a running average: after n pictures,
  // each one counts 1/n.
  const blend = new THREE.ShaderMaterial({
    uniforms: { picture: { value: sample.texture }, weight: { value: 1 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D picture;
      uniform float weight;
      varying vec2 vUv;
      void main() {
        float shadow = texture2D(picture, vUv).a;
        gl_FragColor = vec4(vec3(shadow), weight);
      }`,
    transparent: true, // normal blending: new * weight + old * (1 - weight)
    depthTest: false,
    depthWrite: false,
  });
  const quad = new FullScreenQuad(blend);

  // What the viewer sees: a black ground whose opacity is the averaged shadow.
  const groundMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: darkness,
    alphaMap: average.texture, // alphaMap reads the green channel; all three hold the shadow
    depthWrite: false,
    toneMapped: false,
  });
  const ground = new THREE.Mesh(plane, groundMaterial);
  ground.position.copy(center);
  ground.name = 'baked ground shadow';

  let framesBaked = 0;
  const direction = new THREE.Vector3();
  const clearColor = new THREE.Color();

  const step = (count = 8) => {
    if (framesBaked >= frames) return;
    const previous = {
      target: renderer.getRenderTarget(),
      autoClear: renderer.autoClear,
      shadows: renderer.shadowMap.enabled,
      clearAlpha: renderer.getClearAlpha(),
    };
    renderer.getClearColor(clearColor);
    renderer.autoClear = false;
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(0x000000, 0);
    for (let i = 0; i < count && framesBaked < frames; i++) {
      // A random direction within `spread` of straight up: a point in a disc, then lifted.
      const radius = spread * Math.sqrt(Math.random());
      const angle = Math.random() * Math.PI * 2;
      direction.set(radius * Math.cos(angle), 1, radius * Math.sin(angle)).normalize();
      light.position.copy(center).addScaledVector(direction, size + height);

      renderer.setRenderTarget(sample);
      renderer.clear();
      renderer.render(bake, top); // where the ground is in shadow from this direction

      blend.uniforms.weight.value = 1 / ++framesBaked;
      renderer.setRenderTarget(average);
      quad.render(renderer); // blended into the running average
    }
    renderer.setRenderTarget(previous.target);
    renderer.autoClear = previous.autoClear;
    renderer.shadowMap.enabled = previous.shadows;
    renderer.setClearColor(clearColor, previous.clearAlpha);
  };

  return {
    ground,
    get framesBaked() {
      return framesBaked;
    },
    get done() {
      return framesBaked >= frames;
    },
    step,
    dispose() {
      ground.removeFromParent();
      plane.dispose();
      castOnly.dispose();
      shadowCatcher.dispose();
      groundMaterial.dispose();
      blend.dispose();
      quad.dispose();
      light.dispose(); // frees its shadow map
      sample.dispose();
      average.dispose();
    },
  };
}

// ---- The post-processing chain ----

// The last pass: OutputPass's job (tone mapping and sRGB), then the picture laid over white. The
// scene is drawn with nothing behind it (alpha 0), so the background and the see-through ground
// stay empty until here, and the white is added after tone mapping, where 1.0 means 255. A white
// background drawn into the scene instead gets tone mapped like everything else: 226 of 255.
// Colors arrive scaled by how much of the pixel is covered (premultiplied); dividing that back out
// first keeps the edges of the ring from turning pale. It must be the last pass: three.js only
// adds tone mapping to a ShaderMaterial when it draws to the screen.
const OutputOnWhiteShader = {
  name: 'OutputOnWhiteShader',
  uniforms: { tDiffuse: { value: null } },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      float covered = clamp(color.a, 0.0, 1.0);
      gl_FragColor = vec4(covered > 0.0 ? color.rgb / covered : color.rgb, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      gl_FragColor.rgb = mix(vec3(1.0), gl_FragColor.rgb, covered);
    }`,
};

export type Antialias = 'none' | 'msaa' | 'progressive';

interface FinishingOptions {
  antialias?: Antialias;
  bloom?: { threshold: number; strength: number; radius: number } | null; // null: no bloom pass
}

export interface Finishing {
  composer: EffectComposer;
  renderPass: RenderPass;
  progressive: TAARenderPass;
  bloom: UnrealBloomPass | null;
  outputOnWhite: ShaderPass;
  antialias: Antialias;
  /** How many jittered frames are in the average now: 0 while the view is changing. */
  readonly framesAveraged: number;
  /** Call when the picture changes (the camera or the model moved) so the average starts again. */
  restart(): void;
  /** Draws a frame: call it from the frame loop instead of renderer.render. */
  render(): void;
  dispose(): void;
}

type Accumulating = TAARenderPass & { accumulateIndex: number };

// RenderPass (or TAARenderPass once the view stops) → UnrealBloomPass → tone mapping over white.
// The scene needs scene.background = null, so what's behind the ring stays empty until the last pass.
//   none:        one plain frame each time.
//   msaa:        each pixel's edges sampled 4 times (multisampling), shaded once.
//   progressive: msaa while the view changes; once it stops, TAARenderPass averages 32 frames,
//                each nudged by a different fraction of a pixel, then stops drawing the scene.
export function finishingComposer(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  { antialias = 'progressive', bloom = FAINT_BLOOM }: FinishingOptions = {},
): Finishing {
  const cssSize = renderer.getSize(new THREE.Vector2());
  let ratio = renderer.getPixelRatio();
  const target = (samples: number) =>
    new THREE.WebGLRenderTarget(cssSize.x * ratio, cssSize.y * ratio, { type: THREE.HalfFloatType, samples });
  const samplesFor = (mode: Antialias) => (mode === 'none' ? 0 : 4);

  const composer = new EffectComposer(renderer, target(samplesFor(antialias)));
  composer.setPixelRatio(ratio);
  composer.setSize(cssSize.x, cssSize.y);

  const renderPass = new RenderPass(scene, camera, null, new THREE.Color(0x000000), 0); // clear to empty
  const progressive = new TAARenderPass(scene, camera, 0x000000, 0) as Accumulating;
  progressive.accumulate = true; // add one jittered frame per frame; with false, it draws one plain frame
  progressive.enabled = false;
  const bloomPass = bloom ? new UnrealBloomPass(cssSize, bloom.strength, bloom.radius, bloom.threshold) : null;
  if (bloomPass) {
    // Add the glow's color but leave alpha alone, so glow over the background doesn't count as
    // something drawn there: on white, a glow is invisible, as it is in the playground.
    Object.assign(bloomPass.blendMaterial, {
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneFactor,
      blendSrcAlpha: THREE.ZeroFactor,
      blendDstAlpha: THREE.OneFactor,
    });
  }
  const outputOnWhite = new ShaderPass(OutputOnWhiteShader);
  for (const pass of [renderPass, progressive, bloomPass, outputOnWhite]) if (pass) composer.addPass(pass);

  let changed = true;
  let mode = antialias;
  const size = new THREE.Vector2();

  const finishing: Finishing = {
    composer,
    renderPass,
    progressive,
    bloom: bloomPass,
    outputOnWhite,
    get antialias() {
      return mode;
    },
    set antialias(next: Antialias) {
      if (samplesFor(next) !== samplesFor(mode)) composer.reset(target(samplesFor(next)));
      mode = next;
      changed = true;
    },
    get framesAveraged() {
      return progressive.enabled ? Math.max(0, Math.min(progressive.accumulateIndex, PLAYGROUND.progressiveFrames)) : 0;
    },
    restart() {
      changed = true;
    },
    render() {
      // Follow the canvas when it resizes.
      renderer.getSize(size);
      if (!size.equals(cssSize) || renderer.getPixelRatio() !== ratio) {
        cssSize.copy(size);
        ratio = renderer.getPixelRatio();
        composer.setPixelRatio(ratio);
        composer.setSize(size.x, size.y);
        changed = true;
      }
      const averaging = mode === 'progressive' && !changed;
      if (!averaging) progressive.accumulateIndex = -1; // start over once the view is still again
      renderPass.enabled = !averaging;
      progressive.enabled = averaging;
      changed = false;
      composer.render();
    },
    dispose() {
      for (const pass of composer.passes) pass.dispose();
      composer.dispose();
    },
  };
  return finishing;
}
