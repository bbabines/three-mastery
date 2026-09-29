// Scenes for the safe mutation page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, fitModel, overlay } from '@harness/lesson';
import { loadModel, MODELS } from '@harness/models';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const cleanup: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2.5, 2.0, 2.2);
  controls.target.set(0, 1.2, 0);
  const readout = overlay(container, 'readout');
  readout.textContent = 'loading rack-parts.glb…';
  const bar = overlay(container, 'controls');
  scene.children.find((child) => child instanceof THREE.AxesHelper)!.visible = false; // it would poke through the rack

  loadModel(MODELS.rackParts).then((gltf) => {
    const holder = fitModel(gltf.scene, 2, new THREE.Vector3(0, 0.05, 0));
    scene.add(holder);
    holder.updateMatrixWorld(); // the boxes are measured before the first render
    const parts = [...gltf.scene.children];

    // Puts a fresh BoxHelper around each part, added straight to the scene after everything else.
    const addBoxes = () => {
      for (const child of [...scene.children]) if (child instanceof THREE.BoxHelper) child.removeFromParent();
      for (const part of parts) scene.add(new THREE.BoxHelper(part, COLORS.yellow));
    };
    const boxCount = () => scene.children.filter((child) => child instanceof THREE.BoxHelper).length;

    choiceButtons(bar, [
      {
        html: 'before',
        select: () => {
          addBoxes();
          readout.textContent = [
            `for (const part of parts) scene.add(new BoxHelper(part))   // ${boxCount()} boxes`,
            'scene.children: the grid, the axes, the light, the rack, then the 5 boxes',
          ].join('\n');
        },
      },
      {
        html: 'remove inside <code>traverse</code>',
        select: () => {
          addBoxes();
          let result = 'no error';
          try {
            scene.traverse((object) => {
              if (object instanceof THREE.BoxHelper) object.removeFromParent();
            });
          } catch (error) {
            result = `${(error as Error).name}: ${(error as Error).message}`;
          }
          readout.textContent = [
            'scene.traverse((o) => { if (o instanceof BoxHelper) o.removeFromParent(); })',
            `→ ${result}`,
            `removed ${parts.length - boxCount()} of ${parts.length} boxes; ${boxCount()} are still there`,
          ].join('\n');
        },
      },
      {
        html: 'collect, then remove',
        select: () => {
          addBoxes();
          const helpers: THREE.Object3D[] = [];
          scene.traverse((object) => {
            if (object instanceof THREE.BoxHelper) helpers.push(object);
          });
          for (const helper of helpers) helper.removeFromParent();
          readout.textContent = [
            'scene.traverse((o) => { if (o instanceof BoxHelper) helpers.push(o); })',
            'for (const helper of helpers) helper.removeFromParent()',
            `→ no error; removed ${parts.length - boxCount()} of ${parts.length} boxes`,
          ].join('\n');
        },
      },
    ]);
  });
};
