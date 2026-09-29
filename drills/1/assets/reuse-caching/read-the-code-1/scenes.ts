// Scenes for the reuse and caching page. The README places each one with <div data-scene="name">.
import { afterNextRender, choiceButtons, collectResources, fitModel, overlay, slider } from '@harness/lesson';
import { gltfLoader, MODELS } from '@harness/models';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js';

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

// Stands a copy of the J-cups in its spot in a 2 × 4 grid. The four cups sit far apart in the file,
// so they're moved side by side first to make each copy compact.
function place(model: THREE.Object3D, n: number) {
  model.children.forEach((cup, i) => (cup.position.x = i * 0.16));
  const column = n % 4;
  const row = Math.floor(n / 4);
  return fitModel(model, 0.8, new THREE.Vector3(-1.5 + column, 0.05, -0.6 + row * 1.2));
}

export const copies: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0.3, 2.6, 3.9);
  controls.target.set(0, 0.2, 0);
  scene.children.find((child) => child instanceof THREE.AxesHelper)!.visible = false; // it would stand among the copies

  // A table for the copies, lit like them. Drawing it once now puts the grid and the table on the GPU,
  // along with what the renderer needs for any lit material, so the counts below are the copies' alone.
  const table = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.04, 2.5), new THREE.MeshStandardMaterial({ color: '#3a3f4a' }));
  table.position.set(0, 0.03, 0);
  scene.add(table);
  renderer.render(scene, camera);
  const empty = { ...renderer.info.memory };
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const measureLater = afterNextRender(onFrame);

  let shown: THREE.Object3D[] = [];
  let loaded: GLTF[] = [];
  let count = 4;
  let cloning = false;
  let attempt = 0;

  const update = async () => {
    const mine = ++attempt;
    // Take the last copies out and free everything their loads put on the GPU.
    for (const copy of shown) scene.remove(copy);
    for (const gltf of loaded) {
      const { geometries, materials, textures } = collectResources(gltf.scene);
      for (const resource of [...geometries, ...materials, ...textures]) resource.dispose();
    }
    shown = [];
    loaded = [];
    readout.textContent = 'loading…';

    let loads = 0;
    if (cloning) {
      const gltf = await gltfLoader().loadAsync(MODELS.jcups);
      loads = 1;
      loaded = [gltf];
      shown = Array.from({ length: count }, (_, n) => place(gltf.scene.clone(), n));
    } else {
      loaded = await Promise.all(Array.from({ length: count }, () => gltfLoader().loadAsync(MODELS.jcups)));
      loads = count;
      shown = loaded.map((gltf, n) => place(gltf.scene, n));
    }
    if (mine !== attempt) {
      for (const gltf of loaded) {
        const { geometries, materials, textures } = collectResources(gltf.scene);
        for (const resource of [...geometries, ...materials, ...textures]) resource.dispose();
      }
      return;
    }
    scene.add(...shown);

    measureLater(() => {
      if (mine !== attempt) return;
      const geometries = renderer.info.memory.geometries - empty.geometries;
      const textures = renderer.info.memory.textures - empty.textures;
      readout.textContent = [
        cloning
          ? "const gltf = await loader.loadAsync('jcups.glb');  then per copy: gltf.scene.clone()"
          : "per copy: (await loader.loadAsync('jcups.glb')).scene",
        `${plural(loads, 'load', 'loads')}, ${plural(count, 'copy', 'copies')} on screen`,
        `the GPU holds ${plural(geometries, 'geometry', 'geometries')} and ${plural(textures, 'texture', 'textures')}`,
        cloning ? `all ${count} copies share one load's 20 geometries and 1 texture` : `each copy brought its own 20 geometries and 1 texture`,
      ].join('\n');
    });
  };

  choiceButtons(controlsBar, [
    {
      html: 'load each copy',
      select: () => {
        cloning = false;
        update();
      },
    },
    {
      html: 'load once, clone',
      select: () => {
        cloning = true;
        update();
      },
    },
  ]);
  slider(controlsBar, 'copies', { min: 1, max: 8, step: 1, value: count }, (value) => {
    count = value;
    update();
  });
};
