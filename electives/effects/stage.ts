// The Photoreal effects bench: the classic watch on a light floor in WebGPU, lit by its studio EXR
// and one key light, with a colored card that can stand beside it. Each page builds its own
// RenderPipeline on top and draws through `stage.draw`. The stage also times whole frames on
// request (`timeIt`), so every effect's cost is measured on the machine you're using, counts what
// each frame draws, fits the key light's shadow camera around the watch each frame, and keeps each
// scene's glass copy separate (see below).
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three/webgpu';
import { collectResources, fitModel, overlay } from '@harness/lesson';
import { onLeave } from '@harness/teardown';
import type { TslHarness } from '@harness/tsl';

const REFERENCE = '/assets/reference/classic-watch';
// The watch's saved WebGi settings (assets/reference/classic-watch/audit.json).
const ENVIRONMENT_INTENSITY = 0.7709139426;
const ENVIRONMENT_ROTATION = 3.9472152127;

export const CARD_COLORS = { none: null, orange: 0xff6a1a, blue: 0x1f6bff } as const;
export type CardColor = keyof typeof CARD_COLORS;

// What one frame asked the GPU to do. Unlike times, these are the same every frame.
export interface FrameCounts {
  passes: number; // render calls: the scene, its shadow maps, and each full-screen pass
  draws: number;
  triangles: number;
  width: number; // the drawing buffer, in real pixels
  height: number;
}

// Milliseconds a frame, by the clock on the wall. `cost`: frames drawn back to back with one wait
// for the GPU at the end, so the GPU never sits idle between them: what a frame costs when a page
// draws continuously. `oneAtATime`: each frame waited for before the next, which adds the time it
// takes to hear back from the GPU, so it can only read long: an upper bound.
export interface Timing {
  cost: number;
  oneAtATime: number;
}

export interface EffectsStage {
  harness: TslHarness;
  watch: THREE.Object3D;
  ground: THREE.Mesh;
  key: THREE.DirectionalLight;
  ui: HTMLElement;
  readout: HTMLElement;
  setCard(color: CardColor): void;
  // Draws each frame through a page's own pipeline.
  draw(render: () => void): void;
  // The last frame drawn through `draw`.
  frame: FrameCounts;
  // Times frames of `render` (by default the one given to `draw`), after `prepare`. While it runs,
  // no scene on the page draws on its own.
  timeIt(options?: { render?: () => void; prepare?: () => void }): Promise<Timing>;
  timing(): boolean;
  // One frame of `render`, outside the animation loop, as the loop would draw it.
  step(render: () => void): void;
  // Registers something to dispose when the page is left.
  own<T extends { dispose(): void }>(resource: T): T;
  // true (the default): the key light's shadow camera is fitted around the watch and its shadow
  // every frame. false: three.js's own box (near 0.5, far 500, ±5 across), for comparison.
  setShadowFit(fitted: boolean): void;
  // Changes the key light's shadow map size (see the function for why it's more than mapSize.set).
  setShadowMapSize(size: number): void;
  // How far the key light's `bias` moves the shadow, in world units: |bias| × (far − near).
  shadowBiasDistance(): number;
}

// In r186, transmission (the watch's glass) copies the picture into a texture made per render
// target by cloning one shared FramebufferTexture, and clones share their size (`image`). Two
// targets of different sizes, like two scenes at different pixel ratios or SSAA's sample target,
// then resize it back and forth every frame, and WebGPU reports a destroyed texture or an
// out-of-range copy. This gives each clone a size of its own. effectsStage calls it before any
// scene draws, so every page has it; it changes three.js for the whole page, once.
let separateCopies = false;
export function separateFramebufferCopies() {
  if (separateCopies) return;
  separateCopies = true;
  const clone = THREE.Texture.prototype.clone;
  THREE.FramebufferTexture.prototype.clone = function (this: THREE.FramebufferTexture) {
    const copy = clone.call(this) as THREE.FramebufferTexture;
    copy.source = new THREE.TextureSource({ width: this.image.width, height: this.image.height });
    return copy;
  };
}

// The key light's shadow camera, fitted around what casts a shadow (the watch, and the card when
// it's up) and where that shadow lands on the floor. Shadow depth runs from `near` to `far`, and
// `bias` is a share of that range: in three.js's default box (0.5 to 500) the bench's −0.0005 is
// 0.25 world units, enough to lift every shadow off the floor. Fitted, it's a few thousandths.
const fitBox = new THREE.Box3();
const fitView = new THREE.Box3();
const fitPoint = new THREE.Vector3();
const fitCorner = new THREE.Vector3();
const toLight = new THREE.Vector3();
const lightTarget = new THREE.Vector3();
const FIT_MARGIN = 0.1; // room for normalBias and the soft edge's samples
function fitShadowCamera(light: THREE.DirectionalLight, casters: THREE.Object3D[]) {
  fitBox.makeEmpty();
  for (const caster of casters) fitBox.expandByObject(caster);
  if (fitBox.isEmpty()) return;
  const camera = light.shadow.camera;
  light.updateMatrixWorld();
  light.target.updateMatrixWorld();
  // Placed as three.js places it each frame: at the light, looking at its target.
  camera.position.setFromMatrixPosition(light.matrixWorld);
  lightTarget.setFromMatrixPosition(light.target.matrixWorld);
  camera.lookAt(lightTarget);
  camera.updateMatrixWorld();
  toLight.copy(camera.position).sub(lightTarget).normalize();
  fitView.makeEmpty();
  for (let i = 0; i < 8; i++) {
    fitPoint.set(i & 1 ? fitBox.max.x : fitBox.min.x, i & 2 ? fitBox.max.y : fitBox.min.y, i & 4 ? fitBox.max.z : fitBox.min.z);
    fitView.expandByPoint(fitCorner.copy(fitPoint).applyMatrix4(camera.matrixWorldInverse));
    // Where that corner's shadow lands on the floor (y = 0).
    if (toLight.y > 0.05 && fitPoint.y > 0) fitPoint.addScaledVector(toLight, -fitPoint.y / toLight.y);
    fitView.expandByPoint(fitPoint.applyMatrix4(camera.matrixWorldInverse));
  }
  // The camera looks down −z, so depth is −z.
  camera.left = fitView.min.x - FIT_MARGIN;
  camera.right = fitView.max.x + FIT_MARGIN;
  camera.bottom = fitView.min.y - FIT_MARGIN;
  camera.top = fitView.max.y + FIT_MARGIN;
  camera.near = -fitView.max.z - FIT_MARGIN;
  camera.far = -fitView.min.z + FIT_MARGIN;
  camera.updateProjectionMatrix();
}

// r186's own box for a directional light (DirectionalLightShadow): 10 × 10 across, 0.5 to 500 deep.
function defaultShadowCamera(light: THREE.DirectionalLight) {
  Object.assign(light.shadow.camera, { left: -5, right: 5, bottom: -5, top: 5, near: 0.5, far: 500 });
  light.shadow.camera.updateProjectionMatrix();
}

// Waits until the GPU has finished everything sent to it so far. WebGL can't wait without
// stalling the page, so it asks a fence, letting the page breathe between asks (a message to
// itself is the quickest way back).
const channel = new MessageChannel();
const breathe = () => new Promise<void>((resolve) => ((channel.port1.onmessage = () => resolve()), channel.port2.postMessage(0)));
function gpuWaiter(renderer: THREE.WebGPURenderer) {
  const backend = renderer.backend as unknown as { isWebGPUBackend?: boolean; device?: GPUDevice; gl?: WebGL2RenderingContext };
  return async () => {
    if (backend.isWebGPUBackend) return backend.device!.queue.onSubmittedWorkDone();
    const gl = backend.gl!;
    const fence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0)!;
    gl.flush();
    for (;;) {
      const status = gl.clientWaitSync(fence, 0, 0);
      if (status === gl.ALREADY_SIGNALED || status === gl.CONDITION_SATISFIED || status === gl.WAIT_FAILED) break;
      await breathe();
    }
    gl.deleteSync(fence);
  };
}

const median = (values: number[]) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

// The stage that's timing, if any: the others on the page hold still so they don't share the GPU.
let timingStage: object | null = null;

export function effectsStage(harness: TslHarness, ready: (stage: EffectsStage) => void) {
  separateFramebufferCopies();
  const { scene, camera, controls, renderer, container } = harness;
  container.style.height = '520px';
  let left = false;
  const owned = new Set<{ dispose(): void }>();
  const own = <T extends { dispose(): void }>(resource: T): T => {
    if (left) resource.dispose();
    else owned.add(resource);
    return resource;
  };
  onLeave(container, () => {
    left = true;
    if (timingStage === me) timingStage = null;
    const resources = collectResources(scene);
    for (const collection of [resources.geometries, resources.materials, resources.textures]) {
      for (const item of collection) owned.add(item);
    }
    for (const resource of owned) resource.dispose();
    owned.clear();
  });

  // The harness's grid, axes, and sky light would light and clutter every comparison.
  for (const child of [...scene.children]) scene.remove(child);
  scene.background = new THREE.Color(0xf4f4f4);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  camera.fov = 25;
  camera.near = 0.5;
  camera.far = 40;
  camera.position.set(3.2, 4.2, 12.5);
  camera.updateProjectionMatrix();
  controls.target.set(-0.5, 1.1, 0);
  controls.minDistance = 3;
  controls.maxDistance = 16;
  controls.maxPolarAngle = Math.PI / 2 - 0.05;
  controls.update();

  const ui = overlay(container, 'controls');
  const readout = overlay(container, 'readout');
  readout.style.whiteSpace = 'pre-wrap';
  readout.textContent = 'Loading the watch, its leather normal map, and the studio EXR…';
  container.dataset.effectsState = 'loading';

  const ground = new THREE.Mesh(
    own(new THREE.PlaneGeometry(30, 30)),
    // Light gray rather than white, so light added to it still shows after tone mapping.
    own(new THREE.MeshStandardMaterial({ color: 0xbcbcbc, roughness: 0.92 })),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(4, 7, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  defaultShadowCamera(key); // fitted around the watch once it's loaded (`fit` below)
  let shadowFit = true;
  key.shadow.bias = -0.0005;
  key.shadow.normalBias = 0.02;
  scene.add(key, key.target);

  // A matte board standing beside the watch, turned toward it and the camera.
  const cardMaterial = own(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 }));
  const card = new THREE.Mesh(own(new THREE.PlaneGeometry(2.6, 2.6)), cardMaterial);
  card.position.set(-2.5, 1.3, 0.6);
  card.rotation.y = 1.15;
  card.castShadow = card.receiveShadow = true;
  card.visible = false;
  scene.add(card);
  const setCard = (color: CardColor) => {
    const hex = CARD_COLORS[color];
    card.visible = hex !== null;
    if (hex !== null) cardMaterial.color.setHex(hex);
  };

  // In r186 a new mapSize makes the shadow map replace its GPU textures, but what three.js keeps
  // per drawn object (a render object) can hold on to bindings to the destroyed ones, and a pass
  // that hasn't drawn since draws with them: WebGPU reports "Destroyed texture ShadowDepthTexture
  // used in a submit", WebGL "attempt to use a deleted object". Rebuilding materials doesn't
  // replace them. So the map is resized here, between frames, and every render object is
  // dropped; three.js makes fresh ones on the next frame (its shaders and pipelines are cached).
  const setShadowMapSize = (size: number) => {
    if (key.shadow.mapSize.x === size && key.shadow.mapSize.y === size) return;
    key.shadow.mapSize.set(size, size);
    const map = key.shadow.map;
    if (!map) return;
    map.setSize(size, size);
    renderer.initRenderTarget(map);
    (renderer as unknown as { _objects: { dispose(): void } })._objects.dispose();
  };

  // Timing whole frames. r186 can also time each pass on the GPU (`trackTimestamp`), but it adds
  // the passes' times together, and passes overlap on the GPU: on an M4 Pro the sum read 121 to
  // 152 ms for frames that took 16.5. On WebGL 2 its timers can't nest, so some passes go untimed.
  // So the stage times by the clock on the wall instead, only when asked.
  const finished = gpuWaiter(renderer);
  const nodeFrame = (renderer as unknown as { _nodes: { nodeFrame: { update(): void; frameId: number } } })._nodes.nodeFrame;
  let watchModel: THREE.Object3D | null = null; // once it's loaded
  // Every frame, since pages move the light, the watch, and the card.
  const fit = () => {
    if (shadowFit && key.castShadow && watchModel) fitShadowCamera(key, card.visible ? [watchModel, card] : [watchModel]);
  };
  const frame: FrameCounts = { passes: 0, draws: 0, triangles: 0, width: 0, height: 0 };
  const size = new THREE.Vector2();
  const count = () => {
    frame.passes = renderer.info.render.frameCalls;
    frame.draws = renderer.info.render.drawCalls;
    frame.triangles = renderer.info.render.triangles;
    renderer.getDrawingBufferSize(size);
    frame.width = size.x;
    frame.height = size.y;
  };
  // A new frame for three.js's nodes, as the animation loop starts each one: passes and other
  // per-frame work run once a frame, so without it a second draw in the same frame skips them.
  const step = (render: () => void) => {
    if (left) throw new Error('The page was left');
    renderer.info.reset();
    nodeFrame.update();
    (renderer.info as { frame: number }).frame = nodeFrame.frameId;
    fit();
    render();
  };
  const me = {};
  let timing = false;
  let current: () => void = () => undefined; // the render given to `draw`
  const timeIt = async ({ render = current, prepare }: { render?: () => void; prepare?: () => void } = {}): Promise<Timing> => {
    if (timingStage) throw new Error('Already timing');
    timingStage = me;
    timing = true;
    try {
      prepare?.();
      await finished();
      const backToBack = async (frames: number) => {
        const start = performance.now();
        for (let i = 0; i < frames; i++) step(render);
        await finished();
        return (performance.now() - start) / frames;
      };
      // Warm up: the first frames after a change compile shaders, and a GPU that has been
      // idling runs at a low clock until it's kept busy for a while.
      await backToBack(10);
      const warmStart = performance.now();
      let warmFrames = 0;
      while (performance.now() - warmStart < 500 || warmFrames < 30) {
        await backToBack(10);
        warmFrames += 10;
      }
      // Five rounds of about 150 ms each; the middle one is the cost.
      const estimate = (performance.now() - warmStart) / warmFrames;
      const frames = Math.round(clamp(150 / estimate, 10, 300));
      const rounds: number[] = [];
      for (let i = 0; i < 5; i++) rounds.push(await backToBack(frames));
      let total = 0;
      const single = 20;
      for (let i = 0; i < single; i++) {
        const start = performance.now();
        step(render);
        await finished();
        total += performance.now() - start;
      }
      return { cost: median(rounds), oneAtATime: total / single };
    } finally {
      timing = false;
      if (timingStage === me) timingStage = null;
    }
  };

  // Only a scene on screen draws, so two scenes on a page don't share the GPU.
  let onScreen = true;
  const visibility = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
  });
  visibility.observe(container);
  own({ dispose: () => visibility.disconnect() });

  const draco = own(new DRACOLoader().setDecoderPath('/node_modules/three/examples/jsm/libs/draco/'));
  const loadWatch = new GLTFLoader().setDRACOLoader(draco).loadAsync(`${REFERENCE}/classic-watch.glb`);
  const loadEnvironment = new EXRLoader().loadAsync(`${REFERENCE}/studio.exr`).then(own);
  const loadNormal = new THREE.TextureLoader().loadAsync(`${REFERENCE}/textures/leather-normal.jpg`).then(own);

  Promise.all([loadWatch, loadEnvironment, loadNormal])
    .then(([gltf, environment, normalTexture]) => {
      if (left || !container.isConnected) return;
      const watch = fitModel(gltf.scene, 3);
      watch.traverse((object) => {
        // The file's own light belongs to WebGi's ground setup; the bench brings its own.
        if (object instanceof THREE.Light) object.visible = false;
        if (!(object instanceof THREE.Mesh)) return;
        // See-through parts (the glass, the printed numerals) cast no shadow: a shadow map has no
        // blending, so the glass would shade the dial as if it were solid.
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        object.castShadow = !materials.some((material) => material.transparent);
        object.receiveShadow = true;
        for (const material of materials) {
          if (!(material instanceof THREE.MeshStandardMaterial)) continue;
          // WebGi saves some settings outside standard glTF.
          const extras = material.userData.gltfExtensions?.WEBGI_material_extras;
          if (Array.isArray(extras?.normalScale)) material.normalScale.fromArray(extras.normalScale);
          if (typeof extras?.depthWrite === 'boolean') material.depthWrite = extras.depthWrite;
          // The printed numerals are a blended square. A pass that writes several buffers blends
          // only the color, so its clear corners would stamp a square into the normals and the
          // rest. Cut it out instead, which writes nothing where it's clear. As a cutout it's
          // drawn with the solid parts, so it must write depth or the dial paints over it.
          if (material.transparent && material.map && material.opacity === 1) {
            material.transparent = false;
            material.alphaTest = 0.5;
            material.depthWrite = true;
            material.needsUpdate = true;
          }
        }
      });
      for (const resource of Object.values(collectResources(watch)).flatMap((set) => [...set])) own(resource);

      // WebGi keeps the strap's leather normal outside standard glTF, so it's put back by hand,
      // with the repeat, flip, and strength WebGi saved (electives/product/README.md).
      watch.traverse((object) => {
        if (!(object instanceof THREE.Mesh) || !(object.material instanceof THREE.MeshStandardMaterial)) return;
        if (object.material.name !== 'strap') return;
        normalTexture.colorSpace = THREE.NoColorSpace;
        normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping;
        normalTexture.repeat.set(3, 3);
        normalTexture.flipY = true;
        normalTexture.needsUpdate = true;
        object.material.normalMap = normalTexture;
        object.material.normalScale.set(0.3, -0.3);
        object.material.needsUpdate = true;
      });
      scene.add(watch);

      environment.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = environment;
      scene.environmentIntensity = ENVIRONMENT_INTENSITY;
      scene.environmentRotation.y = ENVIRONMENT_ROTATION;

      readout.textContent = '';
      watchModel = watch;
      let frames = 0;
      ready({
        harness,
        watch,
        ground,
        key,
        ui,
        readout,
        setCard,
        draw: (render) => {
          current = render;
          harness.drawWith(() => {
            if (!onScreen && frames >= 3) return;
            if (timingStage) return; // a scene on the page is being timed
            fit();
            render();
            count();
            frames++;
            if (frames === 3) container.dataset.effectsState = 'ready';
          });
        },
        frame,
        timeIt,
        timing: () => timing,
        step,
        own,
        setShadowFit: (fitted) => {
          shadowFit = fitted;
          if (!fitted) defaultShadowCamera(key);
        },
        shadowBiasDistance: () => Math.abs(key.shadow.bias) * (key.shadow.camera.far - key.shadow.camera.near),
        setShadowMapSize,
      });
    })
    .catch((error) => {
      if (left) return;
      container.dataset.effectsState = 'error';
      readout.textContent = `The watch didn't load: ${error instanceof Error ? error.message : String(error)}. Run node electives/product/tools/fetch-reference.mjs.`;
    });
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : word.endsWith('s') ? 'es' : 's'}`;

// "6 passes · 66 draws · 367k triangles · 1.82 M pixels (1560 × 1168)"
export const formatCounts = (frame: FrameCounts) =>
  `${plural(frame.passes, 'pass')} · ${plural(frame.draws, 'draw')} · ${Math.round(frame.triangles / 1000)}k triangles · ` +
  `${((frame.width * frame.height) / 1e6).toFixed(2)} M pixels (${frame.width} × ${frame.height})`;

// "2.10 ms a frame (one at a time: 3.40)"
export const formatTiming = (timing: Timing) => `${timing.cost.toFixed(2)} ms a frame (one at a time: ${timing.oneAtATime.toFixed(2)})`;

// A cost scene's "time it" button, added to `parent`, and the readout lines that go with it: the
// frame's counts, this setting's timing, and every setting timed so far at this pixel ratio.
// `label` names the current setting; `prepare` runs before each timing (finishing a bake, say).
export function costMeter(stage: EffectsStage, parent: HTMLElement, label: () => string, prepare?: () => void) {
  const { renderer } = stage.harness;
  const timed = new Map<string, Timing>();
  let ratio = renderer.getPixelRatio();
  let problem = '';
  const button = document.createElement('button');
  button.textContent = 'time it';
  button.addEventListener('click', () => {
    if (stage.timing() || button.disabled) return;
    button.disabled = true;
    problem = '';
    const name = label();
    stage
      .timeIt({ prepare })
      .then((result) => timed.set(name, result))
      .catch((error) => (problem = `couldn't time it: ${error instanceof Error ? error.message : String(error)}`))
      .finally(() => (button.disabled = false));
  });
  parent.append(button);
  return {
    lines: () => {
      if (renderer.getPixelRatio() !== ratio) {
        ratio = renderer.getPixelRatio();
        timed.clear(); // four times the pixels: start the list over
      }
      const mine = timed.get(label());
      const status = stage.timing()
        ? 'timing: drawing frames back to back, then one at a time…'
        : problem || (mine ? `${label()}: ${formatTiming(mine)}` : 'press time it to measure this setting');
      const list = [...timed].map(([name, timing]) => `${name} ${timing.cost.toFixed(2)}`).join(' · ');
      return [formatCounts(stage.frame), status, list && `timed at pixel ratio ${ratio}, ms a frame: ${list}`].filter(Boolean);
    },
  };
}
