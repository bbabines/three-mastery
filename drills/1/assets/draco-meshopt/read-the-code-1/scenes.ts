// Scenes for the Draco vs Meshopt page. The README places each one with <div data-scene="name">.
import { choiceButtons, collectResources, COLORS, fitModel, formatBytes, formatNumber, geometryBytes, label, overlay } from '@harness/lesson';
import { loadModel, MODELS } from '@harness/models';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const PARTS = [
  { button: 'whole rack', node: undefined, name: 'the whole rack' },
  { button: 'upright', node: '(export) upright numbered 90', name: 'the upright' },
  { button: 'flip-down safety', node: '(export) flipdown safety 4', name: 'the flip-down safety' },
  { button: 'crossmember', node: '(export) crossmember top 4.001', name: 'the top crossmember' },
  { button: 'hardware', node: '(export) fat', name: 'the hardware' },
];

const BAR_HEIGHT = 1.5; // the whole rack's decoded geometry
const bar = (color: string) => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1, 0.3).translate(0, 0.5, 0), new THREE.MeshStandardMaterial({ color }));
  mesh.position.y = 0.05;
  return mesh;
};

export const unpacked: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2.7, 1.8, 4.3);
  controls.target.set(0.65, 1.05, 0);
  scene.children.find((child) => child instanceof THREE.AxesHelper)!.visible = false; // it would poke through the rack

  const fileBar = bar(COLORS.blue);
  fileBar.position.x = 1.45;
  const decodedBar = bar(COLORS.orange);
  decodedBar.position.x = 1.95;
  const fileTag = label('file', COLORS.blue);
  const decodedTag = label('decoded', COLORS.orange);
  scene.add(fileBar, decodedBar, fileTag, decodedTag);

  const readout = overlay(container, 'readout');
  readout.textContent = 'loading rack-parts.glb…';

  loadModel(MODELS.rackParts).then((gltf) => {
    const rack = fitModel(gltf.scene, 2, new THREE.Vector3(-0.1, 0.05, 0));
    scene.add(rack);
    rack.updateMatrixWorld(); // the outline below is measured before the first render
    const { json, associations } = gltf.parser; // the file's own lists, for the compressed sizes

    // The compressed bytes a part's geometry takes in the file: each primitive's Draco data, counted
    // once even when several nodes share the mesh.
    const fileBytes = (part: THREE.Object3D) => {
      const views = new Set<number>();
      part.traverse((object) => {
        const mapping = associations.get(object);
        if (!(object instanceof THREE.Mesh) || mapping?.meshes === undefined || mapping.primitives === undefined) return;
        views.add(json.meshes[mapping.meshes].primitives[mapping.primitives].extensions.KHR_draco_mesh_compression.bufferView);
      });
      let bytes = 0;
      for (const view of views) bytes += json.bufferViews[view].byteLength;
      return bytes;
    };
    const decodedBytes = (part: THREE.Object3D) => {
      let total = 0;
      let indices = 0;
      for (const geometry of collectResources(part).geometries) {
        total += geometryBytes(geometry);
        indices += geometry.index ? geometry.index.array.byteLength : 0;
      }
      return { total, indices };
    };
    const scale = BAR_HEIGHT / decodedBytes(gltf.scene).total;

    let box: THREE.BoxHelper | undefined;
    const show = (partIndex: number) => {
      const { node, name } = PARTS[partIndex];
      let part: THREE.Object3D = gltf.scene;
      if (node) gltf.scene.traverse((object) => (object.userData.name === node ? (part = object) : undefined));
      if (box) scene.remove(box);
      box = node ? new THREE.BoxHelper(part, COLORS.yellow) : undefined;
      if (box) scene.add(box);

      const file = fileBytes(part);
      const decoded = decodedBytes(part);
      fileBar.scale.y = Math.max(file * scale, 0.005);
      decodedBar.scale.y = decoded.total * scale;
      fileTag.position.set(fileBar.position.x, fileBar.position.y + fileBar.scale.y + 0.2, 0);
      decodedTag.position.set(decodedBar.position.x, decodedBar.position.y + decodedBar.scale.y + 0.2, 0);

      readout.innerHTML = [
        `${name}${node ? `: node "${node}"` : ''}`,
        `<span style="color:${COLORS.blue}">in the file, Draco-compressed</span>   ${formatBytes(file)}`,
        `<span style="color:${COLORS.orange}">decoded, what the GPU gets</span>      ${formatBytes(decoded.total)}, ${formatNumber(decoded.total / file, 1)} × the file`,
        `  of which indices              ${formatBytes(decoded.indices)}: 4 bytes each, though the file lists 2`,
      ].join('\n');
    };

    choiceButtons(
      overlay(container, 'controls'),
      PARTS.map((part, i) => ({ html: part.button, select: () => show(i) })),
    );
  });
};
