// Scenes for the visualizing vectors page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, formatVector, overlay, slider, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const NORMAL = new THREE.Vector3(0, 0, 1); // the panel's front, measured from the panel itself

export const normalArrow: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(1.9, 2.1, 2.9);
  controls.target.set(0.2, 0.45, 0);
  sunlight(scene, new THREE.Vector3(2, 4, 3), 1, 2);
  const axes = scene.children.find((child) => child instanceof THREE.AxesHelper);
  if (axes) axes.visible = false; // the table covers the origin

  // A turntable with a panel standing on its rim, tipped back a little.
  const table = new THREE.Group();
  table.position.y = 0.05;
  const disk = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.08, 48), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  const panel = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.05), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  panel.position.set(0.8, 0.5, 0);
  panel.rotation.x = -0.35;
  const front = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.5), new THREE.MeshStandardMaterial({ color: COLORS.white }));
  front.position.z = 0.03; // a white face marks the front, its +Z
  panel.add(front);
  table.add(disk, panel);
  scene.add(table);

  const arrow = new THREE.ArrowHelper(NORMAL, new THREE.Vector3(), 0.9, COLORS.orange, 0.25, 0.14);

  const worldNormal = new THREE.Vector3();
  const worldCenter = new THREE.Vector3();
  const drawn = new THREE.Vector3();
  const panelCenter = new THREE.Vector3();

  const ways = [
    {
      html: '<code>scene.add(new ArrowHelper(normal, panel.position))</code>',
      line: 'scene.add(new ArrowHelper(normal, panel.position))',
      place: () => {
        scene.add(arrow);
        arrow.position.copy(panel.position); // numbers measured from the table, read as a spot in the world
        arrow.setDirection(NORMAL); // (0, 0, 1) read as the world's +Z
      },
    },
    {
      html: '<code>panel.add(new ArrowHelper(normal))</code>',
      line: 'panel.add(new ArrowHelper(normal))',
      place: () => {
        panel.add(arrow);
        arrow.position.set(0, 0, 0);
        arrow.setDirection(NORMAL);
      },
    },
    {
      html: 'converted to the world, every frame',
      line: 'arrow.setDirection(normal.clone().transformDirection(panel.matrixWorld))',
      place: () => {
        scene.add(arrow);
        arrow.position.copy(panel.getWorldPosition(worldCenter));
        arrow.setDirection(worldNormal.copy(NORMAL).transformDirection(panel.matrixWorld));
      },
    },
  ];
  let way = ways[0];
  let turn = 0;

  const bar = overlay(container, 'controls');
  choiceButtons(
    bar,
    ways.map((item) => ({ html: item.html, select: () => (way = item) })),
  );
  slider(bar, 'turn table', { min: -180, max: 180, step: 15, value: turn }, (value) => (turn = value));

  const readout = overlay(container, 'readout');
  onFrame(() => {
    table.rotation.y = THREE.MathUtils.degToRad(turn);
    scene.updateMatrixWorld();
    way.place();
    arrow.updateMatrixWorld();

    worldNormal.copy(NORMAL).transformDirection(panel.matrixWorld);
    drawn.set(0, 1, 0).transformDirection(arrow.matrixWorld); // an ArrowHelper points along its own +Y
    const onPanel = arrow.getWorldPosition(worldCenter).distanceTo(panel.getWorldPosition(panelCenter)) < 1e-6;
    const matches = drawn.angleTo(worldNormal) < 1e-3 && onPanel;
    readout.textContent = [
      way.line,
      `normal ${formatVector(NORMAL)}, measured from the panel itself`,
      `the panel's front, in the world   ${formatVector(worldNormal, 2)}`,
      `the arrow, in the world           ${formatVector(drawn, 2)}  ${matches ? 'matches' : onPanel ? 'wrong way' : 'wrong way, from the wrong spot'}`,
    ].join('\n');
  });
};
