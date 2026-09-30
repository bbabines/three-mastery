// Scenes for the bounding box and sphere page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, formatVector, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const worldBox: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.8, 2.4, 2.7);
  controls.target.set(0.5, 0.9, 0);

  // A hex nut lying flat, built 1 above the mesh's origin so its own box sits clear of the floor.
  const geometry = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 6).translate(0, 1, 0);
  geometry.computeBoundingBox();
  const nut = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  scene.add(nut);

  const shown = new THREE.Box3();
  const helper = new THREE.Box3Helper(shown, COLORS.yellow);
  scene.add(helper);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const values = { x: 1, turn: 40 };
  const ways = [
    { html: '<code>geometry.boundingBox</code>', code: 'geometry.boundingBox', space: 'measured from the nut itself: it never moves' },
    {
      html: '<code>.applyMatrix4(nut.matrixWorld)</code>',
      code: 'geometry.boundingBox.clone().applyMatrix4(nut.matrixWorld)',
      space: 'in the world: a level box around the turned box',
    },
    {
      html: '<code>setFromObject(nut, true)</code>',
      code: 'new Box3().setFromObject(nut, true)',
      space: 'in the world, from every vertex: tighter',
    },
  ];
  let way = 0;

  const update = () => {
    nut.position.x = values.x;
    nut.rotation.y = THREE.MathUtils.degToRad(values.turn);
    nut.updateMatrixWorld();
    if (way === 0) shown.copy(geometry.boundingBox!);
    if (way === 1) shown.copy(geometry.boundingBox!).applyMatrix4(nut.matrixWorld);
    if (way === 2) shown.setFromObject(nut, true);

    readout.textContent = [
      ways[way].code,
      `min ${formatVector(shown.min, 2)}   max ${formatVector(shown.max, 2)}`,
      ways[way].space,
    ].join('\n');
  };

  choiceButtons(
    controlsBar,
    ways.map((item, i) => ({
      html: item.html,
      select: () => {
        way = i;
        update();
      },
    })),
  );
  slider(controlsBar, 'move nut', { min: -1, max: 2, step: 0.5, value: values.x }, (value) => {
    values.x = value;
    update();
  });
  slider(controlsBar, 'turn nut', { min: 0, max: 90, step: 10, value: values.turn }, (value) => {
    values.turn = value;
    update();
  });
};
