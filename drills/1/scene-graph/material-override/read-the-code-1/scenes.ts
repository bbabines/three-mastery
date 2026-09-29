// Scenes for the material override and restore page. The README places each one with <div data-scene="name">.
import { buttonGroup, choiceButtons, COLORS, fitModel, overlay } from '@harness/lesson';
import { loadModel, MODELS } from '@harness/models';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

type How = 'save' | 'noSave' | 'override';

const CODE: Record<How, { on: string; off: string }> = {
  save: {
    on: 'model.traverse(… originals.set(mesh, mesh.material); mesh.material = xray …)',
    off: 'for (const [mesh, material] of originals) mesh.material = material',
  },
  noSave: {
    on: 'model.traverse(… mesh.material = xray …)',
    off: '// nothing was saved, so there is nothing to put back',
  },
  override: {
    on: 'scene.overrideMaterial = xray   // everything the scene draws',
    off: 'scene.overrideMaterial = null',
  },
};

export const xray: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2.7, 2.15, 2.4);
  controls.target.set(0, 1.3, 0);
  const readout = overlay(container, 'readout');
  readout.textContent = 'loading rack-parts.glb…';
  const bar = overlay(container, 'controls');
  scene.children.find((child) => child instanceof THREE.AxesHelper)!.visible = false; // it would poke through the rack

  loadModel(MODELS.rackParts).then((gltf) => {
    const model = gltf.scene;
    scene.add(fitModel(model, 2, new THREE.Vector3(0, 0.05, 0)));
    const meshes: THREE.Mesh[] = [];
    model.traverse((object) => {
      if (object instanceof THREE.Mesh) meshes.push(object);
    });

    // The scene's own record of each mesh's material, so every button can start from the model as
    // loaded. The page's code only gets `originals`, and only when it saves them.
    const asLoaded = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>(meshes.map((mesh) => [mesh, mesh.material]));
    const originals = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>();
    const xrayMaterial = new THREE.MeshBasicMaterial({ color: COLORS.blue, transparent: true, opacity: 0.3, depthWrite: false });

    let how: How = 'save';
    let on = true;

    const update = () => {
      for (const [mesh, material] of asLoaded) mesh.material = material;
      scene.overrideMaterial = null;
      originals.clear();

      // x-ray on
      if (how === 'override') scene.overrideMaterial = xrayMaterial;
      else {
        for (const mesh of meshes) {
          if (how === 'save') originals.set(mesh, mesh.material);
          mesh.material = xrayMaterial;
        }
      }
      // x-ray off, when that's the button pressed
      if (!on) {
        if (how === 'override') scene.overrideMaterial = null;
        if (how === 'save') for (const [mesh, material] of originals) mesh.material = material;
      }

      const ownMaterial = meshes.filter((mesh) => mesh.material === asLoaded.get(mesh)).length;
      const looksLoaded = !scene.overrideMaterial && ownMaterial === meshes.length;
      readout.textContent = [
        `on:   ${CODE[how].on}`,
        on ? '' : `off:  ${CODE[how].off}`,
        `mesh.material is its own for ${ownMaterial} of ${meshes.length} Meshes`,
        on ? 'the rack is drawn in x-ray' : looksLoaded ? 'the rack is back to how it loaded' : 'still x-ray: nothing put the materials back',
      ]
        .filter(Boolean)
        .join('\n');
    };

    choiceButtons(buttonGroup(bar), [
      {
        html: 'swap, save originals',
        select: () => {
          how = 'save';
          update();
        },
      },
      {
        html: 'swap, save nothing',
        select: () => {
          how = 'noSave';
          update();
        },
      },
      {
        html: '<code>overrideMaterial</code>',
        select: () => {
          how = 'override';
          update();
        },
      },
    ]);
    choiceButtons(buttonGroup(bar, 'x-ray:'), [
      {
        html: 'on',
        select: () => {
          on = true;
          update();
        },
      },
      {
        html: 'off',
        select: () => {
          on = false;
          update();
        },
      },
    ]);
  });
};
