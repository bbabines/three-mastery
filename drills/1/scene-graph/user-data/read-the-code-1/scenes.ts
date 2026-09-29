// Scenes for the userData and metadata page. The README places each one with <div data-scene="name">.
import { boxMarkers, choiceButtons, COLORS, fitModel, label, LABEL_LIFT, overlay } from '@harness/lesson';
import { loadModel, MODELS } from '@harness/models';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// Made-up SKUs for the rack's five parts, keyed by each part's name in Blender. The upright holds
// the rest up, so a click isn't allowed to pick it.
const TAGS: Record<string, { sku: string; selectable: boolean }> = {
  '(export) crossmember top 4.001': { sku: 'XM-TOP-4', selectable: true },
  '(export) flipdown safety 4': { sku: 'SAF-FD-4', selectable: true },
  '(export) front stabilizer': { sku: 'STB-FRONT', selectable: true },
  '(export) upright numbered 90': { sku: 'UPR-90', selectable: false },
  '(export) fat': { sku: 'PUB-XM431', selectable: true },
};

// Where each click lands: a Mesh deep inside one of the parts.
const CLICKS = [
  { button: 'a bolt', mesh: '(mat|hardware)_Solid036001' },
  { button: "the pin's knob", mesh: 'Solid010010' },
  { button: 'the pull-up bar', mesh: '(mat|pullup)_XM-431_Pull-Up_Bar001' },
  { button: "the upright's tube", mesh: 'Cube006_1' },
];

export const tags: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2.7, 2.15, 2.4);
  controls.target.set(0, 1.3, 0);
  const readout = overlay(container, 'readout');
  readout.textContent = 'loading rack-parts.glb…';
  const bar = overlay(container, 'controls');
  scene.children.find((child) => child instanceof THREE.AxesHelper)!.visible = false; // it would poke through the rack

  loadModel(MODELS.rackParts).then((gltf) => {
    const model = gltf.scene;
    const holder = fitModel(model, 2, new THREE.Vector3(0, 0.05, 0));
    scene.add(holder);
    holder.updateMatrixWorld(); // the boxes below are measured before the first render

    // The page's tagging code.
    model.traverse((object) => {
      const tag = TAGS[object.userData.name];
      if (tag) Object.assign(object.userData, tag);
    });

    const markers = boxMarkers(scene);
    const clickTag = label('click', COLORS.green);
    scene.add(clickTag);

    const click = (meshName: string) => {
      const mesh = model.getObjectByName(meshName)!;
      let part: THREE.Object3D | null = mesh;
      while (part && part.userData.sku === undefined) part = part.parent;

      markers.clear();
      markers.mark([mesh], COLORS.green);
      markers.mark([part!], part!.userData.selectable ? COLORS.yellow : COLORS.gray);
      const bounds = new THREE.Box3().setFromObject(mesh);
      clickTag.position.set((bounds.min.x + bounds.max.x) / 2, bounds.max.y, (bounds.min.z + bounds.max.z) / 2).add(LABEL_LIFT);
      const { name, sku, selectable } = part!.userData;
      readout.innerHTML = [
        `<span style="color:${COLORS.green}">hit.object</span>.userData    ${JSON.stringify(mesh.userData)}`,
        `<span style="color:${selectable ? COLORS.yellow : COLORS.gray}">part</span>, the first parent with a sku: ${part!.name}`,
        `part.userData.name   '${name}'`,
        `part.userData.sku    '${sku}'   selectable: ${selectable}`,
      ].join('\n');
    };

    choiceButtons(
      bar,
      CLICKS.map((item) => ({ html: item.button, select: () => click(item.mesh) })),
    );
  });
};
