// The Photoreal effects bench: the classic watch on a light floor in WebGPU, lit by its studio EXR
// and one key light, with a colored card that can stand beside it. Each page builds its own
// RenderPipeline on top and draws through `stage.draw`. The stage also times the GPU's work, so
// every effect's cost is measured on the machine you're using.
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
const TIMING_FRAMES = 30;

export const CARD_COLORS = { none: null, orange: 0xff6a1a, blue: 0x1f6bff } as const;
export type CardColor = keyof typeof CARD_COLORS;

export interface EffectsStage {
  harness: TslHarness;
  watch: THREE.Object3D;
  ground: THREE.Mesh;
  key: THREE.DirectionalLight;
  ui: HTMLElement;
  readout: HTMLElement;
  setCard(color: CardColor): void;
  // Draws each frame through a page's own pipeline, timing it.
  draw(render: () => void): void;
  // The GPU's time per frame in milliseconds, averaged over the last 30 frames, or undefined
  // until enough frames are in, or where the GPU can't time itself.
  gpuTime(): number | undefined;
  timingAvailable(): boolean;
  // Starts a fresh average, after a setting changes.
  resetTiming(): void;
  // Registers something to dispose when the page is left.
  own<T extends { dispose(): void }>(resource: T): T;
}

export function effectsStage(harness: TslHarness, ready: (stage: EffectsStage) => void) {
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
  camera.position.set(2.2, 3.0, 8.7);
  camera.updateProjectionMatrix();
  controls.target.set(0, 1.4, 0);
  controls.minDistance = 3;
  controls.maxDistance = 12;
  controls.maxPolarAngle = Math.PI / 2 - 0.05;
  controls.update();

  const ui = overlay(container, 'controls');
  const readout = overlay(container, 'readout');
  readout.style.whiteSpace = 'pre-wrap';
  readout.textContent = 'Loading the watch, its leather normal map, and the studio EXR…';
  container.dataset.effectsState = 'loading';

  const ground = new THREE.Mesh(
    own(new THREE.PlaneGeometry(30, 30)),
    own(new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.92 })),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(4, 7, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = key.shadow.camera.bottom = -4;
  key.shadow.camera.right = key.shadow.camera.top = 4;
  key.shadow.bias = -0.0005;
  key.shadow.normalBias = 0.02;
  scene.add(key, key.target);

  // A matte board standing beside the watch, turned toward it and the camera.
  const cardMaterial = own(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 }));
  const card = new THREE.Mesh(own(new THREE.PlaneGeometry(2.6, 2.6)), cardMaterial);
  card.position.set(-1.75, 1.3, 0.2);
  card.rotation.y = Math.PI / 3;
  card.castShadow = card.receiveShadow = true;
  card.visible = false;
  scene.add(card);
  const setCard = (color: CardColor) => {
    const hex = CARD_COLORS[color];
    card.visible = hex !== null;
    if (hex !== null) cardMaterial.color.setHex(hex);
  };

  // GPU timing: resolve the timestamps after each frame and average the last 30.
  const samples: number[] = [];
  let resolving = false;
  const timingAvailable = () => (renderer.backend as { trackTimestamp?: boolean }).trackTimestamp === true;
  const measure = () => {
    if (resolving || !timingAvailable()) return;
    resolving = true;
    renderer
      .resolveTimestampsAsync(THREE.TimestampQuery.RENDER)
      .then((ms) => {
        if (typeof ms === 'number' && ms > 0) {
          samples.push(ms);
          if (samples.length > TIMING_FRAMES) samples.shift();
        }
      })
      .catch(() => undefined)
      .finally(() => {
        resolving = false;
      });
  };
  const gpuTime = () => (samples.length < TIMING_FRAMES / 2 ? undefined : samples.reduce((sum, ms) => sum + ms, 0) / samples.length);

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
        object.castShadow = object.receiveShadow = true;
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
      let frames = 0;
      ready({
        harness,
        watch,
        ground,
        key,
        ui,
        readout,
        setCard,
        draw: (render) =>
          harness.drawWith(() => {
            render();
            measure();
            frames++;
            if (frames === 3) container.dataset.effectsState = 'ready';
          }),
        gpuTime,
        timingAvailable,
        resetTiming: () => {
          samples.length = 0;
        },
        own,
      });
    })
    .catch((error) => {
      if (left) return;
      container.dataset.effectsState = 'error';
      readout.textContent = `The watch didn't load: ${error instanceof Error ? error.message : String(error)}. Run node electives/product/tools/fetch-reference.mjs.`;
    });
}

// "1.8 ms", or why there's no number yet.
export function formatGpuTime(stage: EffectsStage) {
  if (!stage.timingAvailable()) return "GPU time: this browser can't time the GPU (try Chrome on WebGPU)";
  const ms = stage.gpuTime();
  return ms === undefined ? 'GPU time: measuring…' : `GPU time: ${ms.toFixed(2)} ms a frame`;
}
