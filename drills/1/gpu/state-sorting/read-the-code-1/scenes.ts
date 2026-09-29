// Scenes for the state changes and sorting page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, label, LABEL_LIFT, overlay, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const order: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0.9, 2.9, 5);
  controls.target.set(0, 0.75, -0.2);
  sunlight(scene, new THREE.Vector3(2, 5, 4), 0.8, 2);

  const red = new THREE.MeshStandardMaterial({ color: COLORS.red });
  const blue = new THREE.MeshStandardMaterial({ color: COLORS.blue });
  const glassMaterial = new THREE.MeshStandardMaterial({ color: COLORS.white, transparent: true, opacity: 0.35 });
  const box = new THREE.BoxGeometry(0.7, 0.7, 0.7);

  // Added in this order: glass, A, B, C, D.
  const objects = [
    { name: 'glass', mesh: new THREE.Mesh(new THREE.BoxGeometry(1.4, 1, 0.05), glassMaterial), at: [1.4, 0.55, 2] },
    { name: 'A', mesh: new THREE.Mesh(box, red), at: [-1.6, 0.4, -1.4] },
    { name: 'B', mesh: new THREE.Mesh(box, blue), at: [0.2, 0.4, -2.4] },
    { name: 'C', mesh: new THREE.Mesh(box, red), at: [1.4, 0.4, 0.2] },
    { name: 'D', mesh: new THREE.Mesh(box, blue), at: [-0.6, 0.4, 1.2] },
  ];
  // Each draw records its name, so the readout can list last frame's draw order.
  let drawing: THREE.Mesh[] = [];
  let drawn: THREE.Mesh[] = [];
  for (const { name, mesh, at } of objects) {
    mesh.name = name;
    mesh.position.set(at[0], at[1], at[2]);
    mesh.onBeforeRender = () => void drawing.push(mesh);
    const tag = label(name, name === 'glass' ? COLORS.white : (mesh.material as THREE.MeshStandardMaterial).color.getStyle());
    tag.position.copy(mesh.position).add(LABEL_LIFT).add(new THREE.Vector3(0, 0.1, 0));
    scene.add(mesh, tag);
  }
  const d = objects[4].mesh;

  let ran = '';
  choiceButtons(overlay(container, 'controls'), [
    { html: '<code>renderer.sortObjects = true</code>', select: () => ((renderer.sortObjects = true), (d.renderOrder = 0), (ran = 'renderer.sortObjects = true   // the default')) },
    { html: '<code>renderer.sortObjects = false</code>', select: () => ((renderer.sortObjects = false), (d.renderOrder = 0), (ran = 'renderer.sortObjects = false')) },
    { html: '<code>D.renderOrder = -1</code>', select: () => ((renderer.sortObjects = true), (d.renderOrder = -1), (ran = 'D.renderOrder = -1   // sorting on')) },
  ]);

  const readout = overlay(container, 'readout');
  const colorName = (mesh: THREE.Mesh) => (mesh.material === red ? 'red' : mesh.material === blue ? 'blue' : 'see-through');
  // Runs before each render, so `drawing` holds the frame that was just drawn.
  onFrame(() => {
    if (drawing.length > 0) {
      drawn = drawing;
      drawing = [];
    }
    let switches = 0;
    drawn.forEach((mesh, i) => (switches += Number(i > 0 && mesh.material !== drawn[i - 1].material)));
    readout.textContent = [
      ran,
      `scene order:  ${objects.map((object) => object.name).join(', ')}`,
      `draw order:   ${drawn.map((mesh) => mesh.name).join(', ')}   (${drawn.map(colorName).join(', ')})`,
      `material switches: ${switches}`,
    ].join('\n');
  });
};
