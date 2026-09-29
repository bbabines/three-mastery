// Scenes for the visibility, removal, layers page. The README places each one with <div data-scene="name">.
import { ball, choiceButtons, COLORS, fitModel, label, line, overlay, setLine } from '@harness/lesson';
import { loadModel, MODELS } from '@harness/models';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// The scanner's fixed ray: level, 1.25 up, fired along −X straight through the upright's tube.
const RAY_START = new THREE.Vector3(1.4, 1.25, 0.19);
const RAY_END = new THREE.Vector3(-1.5, 1.25, 0.19);

// Which of the 32 layers an object is on, such as "0" or "1".
const layerOf = (object: THREE.Object3D) =>
  Array.from({ length: 32 }, (_, i) => i)
    .filter((i) => object.layers.isEnabled(i))
    .join(', ');

export const hideTube: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(1.6, 2.3, 3.7);
  controls.target.set(-0.1, 1.3, 0);
  const readout = overlay(container, 'readout');
  readout.textContent = 'loading rack-parts.glb…';
  const bar = overlay(container, 'controls');
  scene.children.find((child) => child instanceof THREE.AxesHelper)!.visible = false; // it would poke through the rack

  const scanner = ball(COLORS.orange, 1, 0.07);
  scanner.position.copy(RAY_START);
  const beam = line(COLORS.orange, 0.8);
  setLine(beam, RAY_START, RAY_END);
  const hitMark = ball(COLORS.red, 1, 0.05);
  const scannerTag = label('scanner', COLORS.orange);
  scannerTag.position.copy(RAY_START).add(new THREE.Vector3(0, 0.25, 0));
  scene.add(scanner, beam, hitMark, scannerTag);

  loadModel(MODELS.rackParts).then((gltf) => {
    const rack = gltf.scene;
    const holder = fitModel(rack, 2, new THREE.Vector3(0, 0.05, 0));
    scene.add(holder);
    holder.updateMatrixWorld();
    const tube = rack.getObjectByName('(mat|main)_Tube_90001')!; // a Group holding two Meshes
    const tubeParent = tube.parent!;
    const tubeMeshes = tube.children as THREE.Mesh[];

    // Raycasters test layer 0 only, like this one, unless told otherwise.
    const raycaster = new THREE.Raycaster(RAY_START, RAY_END.clone().sub(RAY_START).normalize());

    const inScene = (object: THREE.Object3D) => {
      for (let current: THREE.Object3D | null = object; current; current = current.parent) if (current === scene) return true;
      return false;
    };
    const shown = (object: THREE.Object3D) => {
      for (let current: THREE.Object3D | null = object; current; current = current.parent) if (!current.visible) return false;
      return true;
    };

    const reset = () => {
      if (!tube.parent) tubeParent.add(tube);
      tube.visible = true;
      tube.traverse((object) => object.layers.set(0));
    };

    const ways = [
      { button: 'as loaded', code: '// nothing changed', run: () => {} },
      { button: 'hidden', code: 'tube.visible = false', run: () => (tube.visible = false) },
      { button: 'Group on layer 1', code: 'tube.layers.set(1)', run: () => tube.layers.set(1) },
      {
        button: 'all on layer 1',
        code: 'tube.traverse((object) => object.layers.set(1))',
        run: () => tube.traverse((object) => object.layers.set(1)),
      },
      { button: 'removed', code: 'tube.removeFromParent()', run: () => tube.removeFromParent() },
    ];

    choiceButtons(
      bar,
      ways.map((way) => ({
        html: way.button,
        select: () => {
          reset();
          way.run();
          holder.updateMatrixWorld();
          const drawn = tubeMeshes.filter((mesh) => inScene(mesh) && shown(mesh) && mesh.layers.test(camera.layers));
          const hits = raycaster.intersectObject(rack);
          const hitNames = [...new Set(hits.map((hit) => hit.object.name))];
          hitMark.visible = hits.length > 0;
          if (hits.length > 0) hitMark.position.copy(hits[0].point);
          readout.textContent = [
            way.code,
            `drawn:     ${drawn.length} of the tube's 2 Meshes`,
            `ray hits:  ${hitNames.length ? `${hitNames.join(', ')}, the tube's Meshes` : 'nothing'}`,
            `on layer:  the tube Group ${layerOf(tube)}, its Meshes ${tubeMeshes.map(layerOf).join(' and ')}`,
          ].join('\n');
        },
      })),
    );
  });
};
