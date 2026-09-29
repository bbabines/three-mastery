// Scenes for the traverse variants page. The README places each one with <div data-scene="name">.
import { boxMarkers, buttonGroup, choiceButtons, COLORS, fitModel, label, LABEL_LIFT, overlay } from '@harness/lesson';
import { loadModel, MODELS } from '@harness/models';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// Stands the loaded rack just above the floor grid, 2 units tall, in a holder group, and hides the
// axes helper, which would poke through it.
function showRack(scene: THREE.Scene, model: THREE.Object3D) {
  scene.children.find((child) => child instanceof THREE.AxesHelper)!.visible = false;
  const holder = fitModel(model, 2, new THREE.Vector3(0, 0.05, 0));
  holder.name = 'holder';
  scene.add(holder);
  holder.updateMatrixWorld(); // the boxes below are measured before the first render
  return holder;
}

const isMesh = (object: THREE.Object3D): object is THREE.Mesh => (object as THREE.Mesh).isMesh === true;

function isUnder(object: THREE.Object3D, ancestor: THREE.Object3D) {
  for (let current: THREE.Object3D | null = object; current; current = current.parent) {
    if (current === ancestor) return true;
  }
  return false;
}

type Walk = 'children' | 'traverse' | 'traverseVisible';

const CODE: Record<Walk, string> = {
  children: 'const meshes = model.children.filter((object) => object.isMesh)',
  traverse: 'model.traverse((object) => { if (object.isMesh) meshes.push(object); })',
  traverseVisible: 'model.traverseVisible((object) => { if (object.isMesh) meshes.push(object); })',
};

export const walk: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2.5, 2.0, 2.2);
  controls.target.set(0, 1.2, 0);
  const readout = overlay(container, 'readout');
  readout.textContent = 'loading rack-parts.glb…';
  const bar = overlay(container, 'controls');

  loadModel(MODELS.rackParts).then((gltf) => {
    const model = gltf.scene;
    showRack(scene, model);
    const safety = model.getObjectByName('(export)_flipdown_safety_4')!;
    const markers = boxMarkers(scene);
    let walkWith: Walk = 'traverse';

    const update = () => {
      let visited = 0;
      const meshes: THREE.Mesh[] = [];
      const visit = (object: THREE.Object3D) => {
        visited += 1;
        if (isMesh(object)) meshes.push(object);
      };
      if (walkWith === 'children') model.children.forEach(visit);
      else if (walkWith === 'traverse') model.traverse(visit);
      else model.traverseVisible(visit);
      markers.clear();
      markers.mark(meshes);

      const safetyMeshes = meshes.filter((mesh) => isUnder(mesh, safety)).length;
      let safetyLine: string;
      if (walkWith === 'children') safetyLine = 'the first level is the five parts, and none is a Mesh';
      else if (safety.visible) safetyLine = `safety.visible = true: its ${safetyMeshes} Meshes are found`;
      else if (safetyMeshes > 0) safetyLine = `safety.visible = false: its ${safetyMeshes} Meshes are still found, boxed in empty space`;
      else safetyLine = 'safety.visible = false: skipped, and so is everything under it';
      readout.textContent = [
        CODE[walkWith],
        `visited ${visited} objects, found ${meshes.length} Meshes${meshes.length ? ' (yellow boxes)' : ''}`,
        safetyLine,
      ].join('\n');
    };

    choiceButtons(
      buttonGroup(bar),
      (['traverse', 'traverseVisible', 'children'] as const).map((name) => ({
        html: `<code>${name}</code>`,
        select: () => {
          walkWith = name;
          update();
        },
      })),
    );
    choiceButtons(buttonGroup(bar, 'safety:'), [
      {
        html: 'shown',
        select: () => {
          safety.visible = true;
          update();
        },
      },
      {
        html: 'hidden',
        select: () => {
          safety.visible = false;
          update();
        },
      },
    ]);
  });
};

// Where each walk up starts: a Mesh a click could land on, deep inside one of the rack's parts.
const STARTS = [
  { button: 'a bolt', mesh: '(mat|hardware)_Solid036001' },
  { button: "the pin's knob", mesh: 'Solid010010' },
  { button: "the upright's tube", mesh: 'Cube006_1' },
];

export const walkUp: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2.5, 2.0, 2.2);
  controls.target.set(0, 1.2, 0);
  const readout = overlay(container, 'readout');
  readout.textContent = 'loading rack-parts.glb…';
  const bar = overlay(container, 'controls');

  loadModel(MODELS.rackParts).then((gltf) => {
    const model = gltf.scene;
    showRack(scene, model);
    const markers = boxMarkers(scene);
    const tag = label('mesh', COLORS.green);
    scene.add(tag);
    // What the readout calls each object above the rack's parts.
    const nameOf = (object: THREE.Object3D) =>
      object === model ? 'gltf.scene' : object === scene ? 'scene' : object.name || object.type;

    const start = (meshName: string) => {
      const mesh = model.getObjectByName(meshName)!;
      const visited: THREE.Object3D[] = [];
      let part: THREE.Object3D | undefined;
      mesh.traverseAncestors((ancestor) => {
        visited.push(ancestor);
        if (!part && ancestor.name.startsWith('(export)')) part = ancestor;
      });

      markers.clear();
      markers.mark([part!]);
      markers.mark([mesh], COLORS.green);
      const bounds = new THREE.Box3().setFromObject(mesh);
      tag.position.set((bounds.min.x + bounds.max.x) / 2, bounds.max.y, (bounds.min.z + bounds.max.z) / 2).add(LABEL_LIFT);
      const upToPart = visited.indexOf(part!) + 1;
      readout.innerHTML = [
        "mesh.traverseAncestors((a) => { if (!part && a.name.startsWith('(export)')) part = a; })",
        `<span style="color:${COLORS.green}">mesh</span> ${mesh.name}  →  <span style="color:${COLORS.yellow}">part</span> ${part!.name}`,
        `visited  ${visited.slice(0, upToPart).map(nameOf).join(' → ')}`,
        `  then   ${visited.slice(upToPart).map(nameOf).join(' → ')}, after part was found`,
      ].join('\n');
    };

    choiceButtons(
      bar,
      STARTS.map((item) => ({ html: item.button, select: () => start(item.mesh) })),
    );
  });
};
