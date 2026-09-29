// Scenes for the disposal ownership page. The README places each one with <div data-scene="name">.
import {
  afterNextRender,
  choiceButtons,
  collectResources,
  COLORS,
  fitModel,
  formatBytes,
  geometryBytes,
  label,
  overlay,
} from '@harness/lesson';
import { gltfLoader, loadModel, MODELS } from '@harness/models';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js';

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

// Every geometry, material, and texture a loaded model uses, disposed.
function disposeAll(model: THREE.Object3D) {
  const { geometries, materials, textures } = collectResources(model);
  for (const resource of [...geometries, ...materials, ...textures]) resource.dispose();
}

// The bytes a model's geometry and textures take on the GPU, as the runtime memory math page adds them up.
function gpuBytes(model: THREE.Object3D) {
  const { geometries, textures } = collectResources(model);
  let bytes = 0;
  for (const geometry of geometries) bytes += geometryBytes(geometry);
  for (const texture of textures) {
    const { width, height } = texture.image as { width: number; height: number };
    bytes += (THREE.TextureUtils.getByteLength(width, height, texture.format, texture.type) * 4) / 3;
  }
  return bytes;
}

// A floor plate for the variants, lit like them. Drawing it once before counting puts the grid,
// the plate, and what the renderer needs for any lit material on the GPU, so the counts that
// follow are the models' alone.
function plate(scene: THREE.Scene, width: number, depth: number, x = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, 0.04, depth), new THREE.MeshStandardMaterial({ color: '#3a3f4a' }));
  mesh.position.set(x, 0.03, 0);
  scene.add(mesh);
}

const VARIANTS = [
  { url: MODELS.rackParts, name: 'rack parts', size: 1.9 },
  { url: MODELS.jcups, name: 'J-cups', size: 1.5 },
];
const BAR_PER_MB = 0.07;

export const swaps: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(1.2, 1.7, 4.6);
  controls.target.set(0.7, 1.05, 0);
  scene.children.find((child) => child instanceof THREE.AxesHelper)!.visible = false; // it would poke through the models
  plate(scene, 2.2, 1.6);
  // The GPU memory the loaded models hold, as a bar to the right.
  const memoryBar = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1, 0.4).translate(0, 0.5, 0), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  memoryBar.position.set(2.1, 0.05, 0);
  const memoryTag = label('GPU memory', COLORS.orange);
  scene.add(memoryBar, memoryTag);
  renderer.render(scene, camera);
  const empty = { ...renderer.info.memory };

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const measureLater = afterNextRender(onFrame);

  let dispose = false;
  let swapsDone = 0;
  let current: { holder: THREE.Object3D; gltf: GLTF } | undefined;
  let leaked: GLTF[] = []; // removed from the scene but never disposed
  let busy = false;

  const showBar = () => {
    let bytes = current ? gpuBytes(current.gltf.scene) : 0;
    for (const gltf of leaked) bytes += gpuBytes(gltf.scene);
    memoryBar.scale.y = Math.max((bytes / 1e6) * BAR_PER_MB, 0.001);
    memoryTag.position.set(memoryBar.position.x, memoryBar.scale.y + 0.3, 0);
    return bytes;
  };

  const swap = async () => {
    if (busy) return;
    busy = true;
    const next = VARIANTS[swapsDone % VARIANTS.length];
    if (!current) readout.textContent = `loading ${next.name}…`;
    const gltf = await gltfLoader().loadAsync(next.url);
    // The four J-cups sit far apart in the file; stand them side by side so they're big enough to see.
    if (next.url === MODELS.jcups) gltf.scene.children.forEach((cup, n) => (cup.position.x = n * 0.16));
    const holder = fitModel(gltf.scene, next.size, new THREE.Vector3(0, 0.05, 0));
    const old = current;
    if (old) {
      scene.remove(old.holder);
      if (dispose) disposeAll(old.gltf.scene);
      else leaked.push(old.gltf);
    }
    scene.add(holder);
    current = { holder, gltf };
    swapsDone++;
    const bytes = showBar();
    measureLater(() => {
      busy = false;
      readout.textContent = [
        `swap ${swapsDone}: showing ${next.name};  ${dispose ? 'scene.remove(old), then dispose its resources' : 'scene.remove(old)'}`,
        `renderer.info.memory: ${plural(renderer.info.memory.geometries - empty.geometries, 'geometry', 'geometries')}, ` +
          `${plural(renderer.info.memory.textures - empty.textures, 'texture', 'textures')} for models`,
        `models on the GPU: ${1 + leaked.length}, ${formatBytes(bytes)}   (1 on screen${leaked.length ? `, ${leaked.length} removed but not disposed` : ''})`,
      ].join('\n');
    });
  };

  // Switching between the two ways starts over: everything loaded so far is disposed.
  const restart = (withDispose: boolean) => {
    dispose = withDispose;
    for (const gltf of leaked) disposeAll(gltf.scene);
    leaked = [];
    if (current) {
      scene.remove(current.holder);
      disposeAll(current.gltf.scene);
      current = undefined;
    }
    swapsDone = 0;
    busy = false;
    swap();
  };

  choiceButtons(controlsBar, [
    { html: '<code>scene.remove(old)</code>', select: () => restart(false) },
    { html: '<code>remove</code>, then <code>dispose</code>', select: () => restart(true) },
  ]);
  const swapButton = document.createElement('button');
  swapButton.textContent = 'swap variant';
  swapButton.addEventListener('click', swap);
  controlsBar.append(swapButton);
};

export const shared: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0, 1.9, 4.6);
  controls.target.set(0, 1.25, 0);
  scene.children.find((child) => child instanceof THREE.AxesHelper)!.visible = false; // it would poke through the racks
  plate(scene, 1.4, 1.6, -0.9);
  plate(scene, 1.4, 1.6, 0.9);
  const gone = label('copy A: removed', COLORS.gray);
  gone.position.set(-0.9, 1.1, 0);
  const tagB = label('copy B', COLORS.white);
  tagB.position.set(0.9, 2.15, 0);
  scene.add(gone, tagB);
  renderer.render(scene, camera);
  const empty = { ...renderer.info.memory, programs: renderer.info.programs?.length ?? 0 };

  const readout = overlay(container, 'readout');
  readout.textContent = 'loading rack-parts.glb…';
  const measureLater = afterNextRender(onFrame);

  loadModel(MODELS.rackParts).then((gltf) => {
    // Two clones of one load: they share every geometry, material, and texture.
    const copyA = fitModel(gltf.scene.clone(), 1.8, new THREE.Vector3(-0.9, 0.05, 0));
    const copyB = fitModel(gltf.scene.clone(), 1.8, new THREE.Vector3(0.9, 0.05, 0));
    scene.add(copyB);
    let attempt = 0;

    const count = () => ({
      geometries: renderer.info.memory.geometries - empty.geometries,
      textures: renderer.info.memory.textures - empty.textures,
      programs: (renderer.info.programs?.length ?? 0) - empty.programs,
    });
    const describe = (state: ReturnType<typeof count>) =>
      `${plural(state.geometries, 'geometry', 'geometries')}, ${plural(state.textures, 'texture', 'textures')}, ` +
      `${plural(state.programs, 'program', 'programs')}`;

    const run = (code: string, act: () => string) => {
      const mine = ++attempt;
      // Start from both copies drawn and everything on the GPU.
      scene.add(copyA);
      gone.visible = false;
      renderer.render(scene, camera);
      scene.remove(copyA);
      gone.visible = true;
      const note = act();
      const rightAfter = count();
      readout.textContent = `${code}\n…`;
      measureLater(() => {
        if (mine !== attempt) return;
        const next = count();
        const again = next.geometries - rightAfter.geometries;
        readout.textContent = [
          code,
          `right after:  ${describe(rightAfter)} on the GPU`,
          `next render:  ${describe(next)}`,
          again > 0
            ? 'copy B still draws them, so the next render uploaded and compiled them all again'
            : note || 'copy B draws with the same GPU copies as before: nothing to redo',
        ].join('\n');
      });
    };

    choiceButtons(overlay(container, 'controls'), [
      { html: 'remove A only', select: () => run('scene.remove(copyA)', () => '') },
      {
        html: 'dispose what only A uses',
        select: () =>
          run('scene.remove(copyA); dispose what copy B doesn\'t use', () => {
            const usedByB = collectResources(copyB);
            const usedByA = collectResources(copyA);
            let freed = 0;
            for (const kind of ['geometries', 'materials', 'textures'] as const) {
              for (const resource of usedByA[kind] as Set<{ dispose(): void }>) {
                if ((usedByB[kind] as Set<unknown>).has(resource)) continue;
                resource.dispose();
                freed++;
              }
            }
            return freed === 0 ? 'nothing to dispose: A shares everything with B, which draws on as before' : `${freed} disposed`;
          }),
      },
      {
        html: 'dispose everything under A',
        select: () =>
          run('scene.remove(copyA); dispose every geometry, material, texture under it', () => {
            disposeAll(copyA);
            return '';
          }),
      },
    ]);
  });
};
