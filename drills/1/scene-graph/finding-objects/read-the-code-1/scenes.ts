// Scenes for the finding objects page. The README places each one with <div data-scene="name">.
import { boxMarkers, choiceButtons, COLORS, fitModel, label, overlay } from '@harness/lesson';
import { loadModel, MODELS } from '@harness/models';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const twoRacks: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.9, 2.3, 4.2);
  controls.target.set(0, 1.0, 0);
  const readout = overlay(container, 'readout');
  readout.textContent = 'loading rack-parts.glb twice…';
  const bar = overlay(container, 'controls');
  scene.children.find((child) => child instanceof THREE.AxesHelper)!.visible = false; // it would poke through rack a

  // Two separate loads of one file: two complete copies, with the same names throughout.
  Promise.all([loadModel(MODELS.rackParts), loadModel(MODELS.rackParts)]).then(([first, second]) => {
    const rackA = first.scene;
    const rackB = second.scene;
    const spots = [new THREE.Vector3(-0.75, 0.05, 0), new THREE.Vector3(0.75, 0.05, 0)];
    [rackA, rackB].forEach((rack, i) => {
      const holder = fitModel(rack, 1.7, spots[i]);
      scene.add(holder);
      holder.updateMatrixWorld(); // the boxes below are measured before the first render
      const tag = label(i === 0 ? 'rackA' : 'rackB', COLORS.white);
      tag.position.set(spots[i].x, 1.95, 0);
      scene.add(tag);
    });
    const markers = boxMarkers(scene);
    const whose = (object: THREE.Object3D) => {
      for (let current: THREE.Object3D | null = object; current; current = current.parent) {
        if (current === rackA) return 'rackA';
        if (current === rackB) return 'rackB';
      }
      return 'neither rack';
    };

    const searches = [
      {
        button: 'search the scene',
        run: () => {
          const pin = scene.getObjectByName('pin')!;
          markers.mark([pin]);
          return [
            "const pin = scene.getObjectByName('pin')",
            `→ ${whose(pin)}'s pin (yellow box): the first match`,
            "  rackB's pin has the same name, but the search stopped before it",
          ];
        },
      },
      {
        button: 'search one copy',
        run: () => {
          const pin = rackB.getObjectByName('pin')!;
          markers.mark([pin]);
          return ["const pin = rackB.getObjectByName('pin')", `→ ${whose(pin)}'s pin: a search inside one copy only finds that copy's`];
        },
      },
      {
        button: 'every match',
        run: () => {
          const pins = scene.getObjectsByProperty('name', 'pin');
          markers.mark(pins);
          return [
            "const pins = scene.getObjectsByProperty('name', 'pin')",
            `→ ${pins.length} objects: ${pins.map((pin) => `${whose(pin)}'s pin`).join(' and ')}`,
          ];
        },
      },
      {
        button: 'the Blender name',
        run: () => {
          const blenderName = rackA.getObjectByName('(export) flipdown safety 4');
          const safety = rackA.getObjectByName('(export)_flipdown_safety_4')!;
          markers.mark([safety]);
          return [
            `rackA.getObjectByName('(export) flipdown safety 4')   → ${blenderName}`,
            `rackA.getObjectByName('(export)_flipdown_safety_4')   → found (yellow box)`,
            `safety.userData.name   '${safety.userData.name}'`,
          ];
        },
      },
    ];

    choiceButtons(
      bar,
      searches.map((search) => ({
        html: search.button,
        select: () => {
          markers.clear();
          readout.textContent = search.run().join('\n');
        },
      })),
    );
  });
};
