// Scenes for the filtering page. The README places each one with <div data-scene="name">.
import { ball, choiceButtons, COLORS, label, overlay, pointerSpot, pointerToNdc } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const solid = (color: string) => new THREE.MeshStandardMaterial({ color });

function part(name: string, geometry: THREE.BufferGeometry, color: string, x: number, y: number, z: number) {
  const mesh = new THREE.Mesh(geometry, solid(color));
  mesh.name = name;
  mesh.position.set(x, y, z);
  return mesh;
}

export const whatGetsHit: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0.4, 2.3, 3.3);
  controls.target.set(0.1, 0.4, -0.4);

  // A shelf with two products on it. Each product is a group of meshes, marked with an sku.
  const shelf = new THREE.Group();
  shelf.add(
    part('left post', new THREE.BoxGeometry(0.08, 1, 0.08), COLORS.gray, -1.1, 0.5, -0.6),
    part('right post', new THREE.BoxGeometry(0.08, 1, 0.08), COLORS.gray, 1.1, 0.5, -0.6),
    part('plank', new THREE.BoxGeometry(2.4, 0.08, 0.9), COLORS.gray, 0, 0.5, -0.6),
  );
  const toolbox = new THREE.Group();
  toolbox.name = 'toolbox';
  toolbox.userData.sku = 'TB-200';
  toolbox.add(
    part('toolbox body', new THREE.BoxGeometry(0.8, 0.4, 0.4), COLORS.red, 0, 0.2, 0),
    part('handle', new THREE.TorusGeometry(0.16, 0.035, 8, 24, Math.PI), COLORS.gray, 0, 0.4, 0),
  );
  toolbox.position.set(-0.5, 0.54, -0.6);
  const crate = new THREE.Group();
  crate.name = 'crate';
  crate.userData.sku = 'CR-10';
  crate.add(part('crate box', new THREE.BoxGeometry(0.5, 0.5, 0.5), COLORS.orange, 0, 0.25, 0));
  crate.position.set(0.6, 0.54, -0.6);
  const loose = part('box on the floor', new THREE.BoxGeometry(0.45, 0.45, 0.45), COLORS.blue, 1.6, 0.23, -0.1);
  loose.userData.sku = 'BX-5';
  const shelfTag = label('shelf', COLORS.gray);
  shelfTag.position.set(-1.1, 1.25, -0.6);
  const marker = ball(COLORS.white, 1, 0.05);
  marker.raycast = () => {}; // kept out of every raycast, or it would be hit itself
  scene.add(shelf, toolbox, crate, loose, shelfTag, marker);
  scene.updateMatrixWorld(); // the first raycast comes before any render

  const pickable = [toolbox, crate, loose];
  for (const product of pickable) product.traverse((object) => object.layers.enable(1));
  const products = new Set<THREE.Object3D>(pickable);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const canvas = renderer.domElement;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let mode: 'scene' | 'list' | 'layers' = 'scene';

  choiceButtons(controlsBar, [
    { html: '<code>intersectObjects(scene.children)</code>', select: () => (mode = 'scene') },
    { html: '<code>intersectObjects(pickable)</code>', select: () => (mode = 'list') },
    { html: '<code>raycaster.layers.set(1)</code>', select: () => (mode = 'layers') },
  ]);
  pointerSpot(container, canvas, controlsBar, (event) => pointerToNdc(event, canvas, pointer), { across: 0.42, down: 0.45 });

  onFrame(() => {
    raycaster.setFromCamera(pointer, camera);
    raycaster.layers.set(mode === 'layers' ? 1 : 0);
    const hits = raycaster.intersectObjects(mode === 'list' ? pickable : scene.children);
    const hit = hits[0];

    let found: THREE.Object3D | null = hit ? hit.object : null;
    while (found && !found.userData.sku) found = found.parent;
    for (const product of products) {
      product.traverse((object) => {
        if (object instanceof THREE.Mesh) object.material.emissive.set(product === found ? '#444444' : '#000000');
      });
    }
    marker.visible = !!hit;
    if (hit) marker.position.copy(hit.point);

    const what = !hit
      ? 'nothing'
      : hit.object instanceof THREE.Mesh
        ? `the mesh "${hit.object.name}"`
        : `${/^[AEIOU]/.test(hit.object.type) ? 'an' : 'a'} ${hit.object.type}${hit.object.type.endsWith('Helper') ? ', a helper line' : ''}`;
    readout.textContent = [
      mode === 'list'
        ? 'raycaster.intersectObjects(pickable)'
        : mode === 'layers'
          ? 'raycaster.layers.set(1); raycaster.intersectObjects(scene.children)'
          : 'raycaster.intersectObjects(scene.children)',
      `hits[0].object: ${what}`,
      `walk up to userData.sku → ${found ? `${found.name} (${found.userData.sku})` : 'none'}`,
    ].join('\n');
  });
};
