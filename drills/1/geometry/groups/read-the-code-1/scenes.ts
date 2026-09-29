// Scenes for the groups and multi-material page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, overlay, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { mergeGroups } from 'three/addons/utils/BufferGeometryUtils.js';

const SIDE_COLORS = [COLORS.orange, COLORS.purple, COLORS.green, COLORS.red, COLORS.yellow, COLORS.blue];

export const crate: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(1.9, 2.2, 2.9);
  controls.target.set(0, 1.1, 0);
  sunlight(scene, new THREE.Vector3(3, 5, 4), 0.8, 2);

  // The grid and axes are lines, so they'd add two draw calls to every count.
  for (const child of scene.children) {
    if (child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper) child.visible = false;
  }

  const box = new THREE.BoxGeometry(1.2, 1.2, 1.2); // six groups, one per side
  const alternating = box.clone();
  alternating.groups.forEach((group, i) => (group.materialIndex = Math.floor(i / 2) % 2)); // 0, 0, 1, 1, 0, 0
  const merged = mergeGroups(alternating.clone());

  const one = new THREE.MeshStandardMaterial({ color: COLORS.orange });
  const six = SIDE_COLORS.map((color) => new THREE.MeshStandardMaterial({ color }));
  const two = [new THREE.MeshStandardMaterial({ color: COLORS.orange }), new THREE.MeshStandardMaterial({ color: COLORS.blue })];

  const mesh = new THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>(box, one);
  mesh.position.y = 1.1;
  scene.add(mesh);

  const versions = [
    { html: 'one material', code: 'new Mesh(box, material)', geometry: box, material: one as THREE.Material | THREE.Material[] },
    { html: 'six materials', code: 'new Mesh(box, [6 materials])', geometry: box, material: six },
    { html: 'two materials', code: 'materialIndex of the 6 groups: 0, 0, 1, 1, 0, 0;  new Mesh(box, [paint, tape])', geometry: alternating, material: two },
    { html: '<code>mergeGroups</code>', code: 'mergeGroups(geometry);  new Mesh(geometry, [paint, tape])', geometry: merged, material: two },
  ];
  let current = versions[0];
  choiceButtons(
    overlay(container, 'controls'),
    versions.map((version) => ({
      html: version.html,
      select: () => {
        current = version;
        mesh.geometry = version.geometry;
        mesh.material = version.material;
      },
    })),
  );

  const readout = overlay(container, 'readout');
  // Runs before each render, so the count is from the frame that was just drawn.
  onFrame(() => {
    const materials = Array.isArray(current.material) ? current.material.length : 1;
    readout.textContent = [
      current.code,
      `geometry.groups.length ${current.geometry.groups.length}   ${materials === 1 ? 'one material: groups ignored' : `material array of ${materials}`}`,
      `renderer.info.render.calls  ${renderer.info.render.calls}`,
    ].join('\n');
  });
};
