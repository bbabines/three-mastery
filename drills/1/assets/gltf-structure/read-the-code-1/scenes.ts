// Scenes for the glTF structure page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, fitModel, overlay } from '@harness/lesson';
import { loadModel, MODELS } from '@harness/models';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js';

// Colors for the Meshes inside a part, one per primitive.
const PRIMITIVE_COLORS = [COLORS.orange, COLORS.green, COLORS.purple];
const swatch = (i: number) => `<span style="color:${PRIMITIVE_COLORS[i % PRIMITIVE_COLORS.length]}">■</span>`;

// The object a glTF node became, found by the node's original name, which GLTFLoader keeps in
// userData.name.
function byNodeName(model: THREE.Object3D, name: string) {
  let found: THREE.Object3D | undefined;
  model.traverse((object) => {
    if (object.userData.name === name) found = object;
  });
  return found!;
}

// The Meshes a node became: the node itself, or the Meshes inside its Group.
function meshesOf(object: THREE.Object3D) {
  if (object instanceof THREE.Mesh) return [object];
  return object.children.filter((child): child is THREE.Mesh => child instanceof THREE.Mesh);
}

const materialName = (mesh: THREE.Mesh) => (mesh.material as THREE.Material).name;

// Outlines a part with a box and can paint each of its Meshes in its own flat color. clear() puts
// the loaded materials back.
function highlighter(scene: THREE.Scene) {
  const originals = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>();
  let box: THREE.BoxHelper | undefined;
  const clear = () => {
    for (const [mesh, material] of originals) mesh.material = material;
    originals.clear();
    if (box) scene.remove(box);
  };
  const mark = (part: THREE.Object3D, paint: boolean) => {
    box = new THREE.BoxHelper(part, COLORS.yellow);
    scene.add(box);
    if (!paint) return;
    meshesOf(part).forEach((mesh, i) => {
      originals.set(mesh, mesh.material);
      mesh.material = new THREE.MeshStandardMaterial({ color: PRIMITIVE_COLORS[i % PRIMITIVE_COLORS.length] });
    });
  };
  return { clear, mark };
}

function showRack(gltf: GLTF, scene: THREE.Scene) {
  scene.children.find((child) => child instanceof THREE.AxesHelper)!.visible = false; // it would poke through the rack
  const rack = fitModel(gltf.scene, 2.2, new THREE.Vector3(0, 0.05, 0));
  scene.add(rack);
  rack.updateMatrixWorld(); // the outlines below are measured before the first render
}

const PARTS = [
  { button: 'upright tube', node: '(mat|main) Tube_90.001' },
  { button: 'pin', node: 'pin' },
  { button: 'weld', node: '(mat|main) Weld005.001' },
  { button: 'bolt', node: '(mat|hardware) Solid036.001' },
  { button: 'node with no mesh', node: '(export) flipdown safety 4' },
];

const VIEW_DIRECTION = new THREE.Vector3(1, 0.55, 1.4).normalize();

export const tree: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2.3, 1.7, 3.2);
  controls.target.set(0.2, 1.05, 0);
  const readout = overlay(container, 'readout');
  readout.textContent = 'loading rack-parts.glb…';
  const controlsBar = overlay(container, 'controls');

  // Turns the camera toward a part and moves in until it fills the view, however small it is.
  const focus = (part: THREE.Object3D) => {
    const bounds = new THREE.Box3().setFromObject(part, true);
    const center = bounds.getCenter(new THREE.Vector3());
    const radius = Math.max(bounds.getSize(new THREE.Vector3()).length() / 2, 0.08);
    controls.target.copy(center);
    camera.position.copy(center).addScaledVector(VIEW_DIRECTION, radius * 3.3);
  };

  loadModel(MODELS.rackParts).then((gltf) => {
    showRack(gltf, scene);
    const { json } = gltf.parser; // the file's own lists, for the glTF side of the readout
    const { clear, mark } = highlighter(scene);

    const show = (nodeName: string) => {
      clear();
      const part = byNodeName(gltf.scene, nodeName);
      const meshes = meshesOf(part);
      const names = meshes.map(materialName);
      mark(part, true);
      focus(part);

      const nodeDef = json.nodes.find((node: { name?: string }) => node.name === nodeName);
      const meshDef = nodeDef.mesh === undefined ? undefined : json.meshes[nodeDef.mesh];
      if (!meshDef) {
        readout.textContent = [
          `glTF node "${nodeName}", no mesh`,
          `→ ${part.type} "${part.name}" holding ${part.children.length} child nodes`,
        ].join('\n');
      } else if (part instanceof THREE.Mesh) {
        readout.innerHTML = [
          `glTF node "${nodeName}", mesh "${meshDef.name}" with 1 primitive`,
          `→ Mesh "${part.name}": the node itself`,
          `    material "${names[0]}"   ${swatch(0)}`,
        ].join('\n');
      } else {
        readout.innerHTML = [
          `glTF node "${nodeName}", mesh "${meshDef.name}" with ${meshDef.primitives.length} primitives`,
          `→ ${part.type} "${part.name}" holding ${meshes.length} Meshes:`,
          ...meshes.map((mesh, i) => `    Mesh "${mesh.name}"`.padEnd(28) + `material "${names[i]}"   ${swatch(i)}`),
        ].join('\n');
      }
    };

    choiceButtons(
      controlsBar,
      PARTS.map((part) => ({ html: part.button, select: () => show(part.node) })),
    );
  });
};

export const names: SceneSetup = ({ scene, camera, controls, container }) => {
  controls.target.set(0.1, 1.3, 0);
  camera.position.copy(controls.target).addScaledVector(VIEW_DIRECTION, 4.8);
  const readout = overlay(container, 'readout');
  readout.textContent = 'loading rack-parts.glb…';
  const controlsBar = overlay(container, 'controls');

  loadModel(MODELS.rackParts).then((gltf) => {
    showRack(gltf, scene);
    const model = gltf.scene;
    const { clear, mark } = highlighter(scene);

    choiceButtons(controlsBar, [
      {
        html: 'by the Blender name',
        select: () => {
          clear();
          const found = model.getObjectByName('(mat|main) Tube_90.001');
          if (found) mark(found, false);
          readout.textContent = [
            "const tube = model.getObjectByName('(mat|main) Tube_90.001')",
            `→ ${found}: no object has that name`,
            "  it's the name from Blender, before GLTFLoader cleaned it",
          ].join('\n');
        },
      },
      {
        html: 'by the cleaned name',
        select: () => {
          clear();
          const found = model.getObjectByName('(mat|main)_Tube_90001')!;
          mark(found, false);
          readout.textContent = [
            "const tube = model.getObjectByName('(mat|main)_Tube_90001')",
            `→ found: a ${found.type}, outlined in yellow`,
            `  tube.userData.name   '${found.userData.name}'`,
          ].join('\n');
        },
      },
      {
        html: '<code>tube.material</code>',
        select: () => {
          clear();
          const tube = model.getObjectByName('(mat|main)_Tube_90001')!;
          const loaded = meshesOf(tube).map(materialName);
          mark(tube, true);
          readout.innerHTML = [
            `tube.material                    ${(tube as THREE.Object3D & { material?: unknown }).material}: a Group has no material`,
            `tube.children.length             ${tube.children.length}, one Mesh per primitive`,
            `tube.children[0].material.name   '${loaded[0]}'   ${swatch(0)}`,
            `tube.children[1].material.name   '${loaded[1]}'   ${swatch(1)}`,
          ].join('\n');
        },
      },
    ]);
  });
};
