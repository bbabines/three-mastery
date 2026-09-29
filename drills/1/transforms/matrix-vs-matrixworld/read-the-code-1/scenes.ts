// Scenes for the matrix vs matrixWorld page. The README places each one with <div data-scene="name">.
import { arrow, ball, COLORS, formatVector, label, LABEL_LIFT, line, overlay, setArrow, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// The place a saved transform puts an object's origin: the move part of the matrix.
const spotIn = (matrix: THREE.Matrix4) => new THREE.Vector3().setFromMatrixPosition(matrix);

const solid = (color: string, opacity = 1) =>
  new THREE.MeshStandardMaterial({ color, transparent: opacity < 1, opacity, depthWrite: opacity === 1 });

export const twoMatrices: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.85, 3.3, 4.45);
  controls.target.set(0.4, 0.9, -0.8);

  // The table's origin sits on its top surface, raised off the floor grid.
  const table = new THREE.Group();
  table.position.set(1.9, 0.15, -1.6);
  const top = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.1, 48), solid(COLORS.blue));
  top.position.y = -0.05;
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1), solid(COLORS.gray));
  const tableTag = label('table', COLORS.blue);
  tableTag.position.set(0.75, 0.15, 0.55);

  // The shelf's origin sits just above its plank, so its axes don't hide in the plank's top.
  // The axes show the frame the shelf measures its children from.
  const shelf = new THREE.Group();
  const plank = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 0.8), solid(COLORS.gray));
  plank.position.y = -0.06;
  const shelfTag = label('shelf', COLORS.gray);
  shelfTag.position.set(-0.75, 0.2, -0.3);

  const box = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), solid(COLORS.yellow));
  box.rotation.y = THREE.MathUtils.degToRad(30); // its own slight turn, which box.matrix keeps
  const boxTag = label('box', COLORS.yellow);
  boxTag.position.y = 0.4;
  box.add(boxTag);
  // Drawn inside the shelf, so it rides along: the box's move as the shelf measures it.
  const fromShelf = arrow(COLORS.orange);
  shelf.add(plank, new THREE.AxesHelper(0.4), shelfTag, box, fromShelf);
  table.add(top, post, tableTag, shelf);

  // The same box drawn with box.matrix alone, straight from the center of the scene.
  const ghost = new THREE.Mesh(box.geometry, solid(COLORS.yellow, 0.3));
  ghost.matrixAutoUpdate = false; // placed by copying box.matrix into it, below
  const ghostTag = label('box.matrix alone', COLORS.gray);
  const fromOrigin = arrow(COLORS.orange);
  scene.add(table, ghost, ghostTag, fromOrigin);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  const values = { slide: 0.6, height: 0.8, turn: 0 };
  const origin = new THREE.Vector3();

  const update = () => {
    box.position.set(values.slide, 0.2, 0.2);
    shelf.position.y = values.height;
    post.scale.y = values.height - 0.1;
    post.position.y = (values.height - 0.1) / 2;
    table.rotation.y = THREE.MathUtils.degToRad(values.turn);

    // Refresh the saved transforms now, so the readout matches this slider step. The update
    // timing page explains why reading them right after a change needs this.
    table.updateMatrixWorld();

    ghost.matrix.copy(box.matrix);
    const ownSpot = spotIn(box.matrix);
    setArrow(fromShelf, origin, box.position);
    setArrow(fromOrigin, origin, ownSpot);
    ghostTag.position.copy(ownSpot).add(LABEL_LIFT);

    readout.innerHTML = [
      `<span style="color:${COLORS.orange}">→</span> box.matrix       places it at ${formatVector(ownSpot).padEnd(16)} measured from the shelf`,
      `<span style="color:${COLORS.yellow}">■</span> box.matrixWorld  places it at ${formatVector(spotIn(box.matrixWorld)).padEnd(16)} in the world`,
    ].join('\n');
  };
  slider(sliders, 'Slide box', { min: -0.6, max: 0.6, step: 0.2, value: values.slide }, (value) => {
    values.slide = value;
    update();
  });
  slider(sliders, 'Raise shelf', { min: 0.4, max: 1.2, step: 0.2, value: values.height }, (value) => {
    values.height = value;
    update();
  });
  slider(sliders, 'Turn table', { min: -180, max: 180, step: 15, value: values.turn }, (value) => {
    values.turn = value;
    update();
  });
  update();
};

const SPOTS = [
  new THREE.Vector3(-1.5, 0.8, 0),
  new THREE.Vector3(1.5, 1.3, -1),
  new THREE.Vector3(0.5, 0.5, 1),
  new THREE.Vector3(-0.8, 1.6, -1.2),
];

export const staleRead: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0, 2.65, 4.6);
  controls.target.set(0, 1.25, -0.2);

  const drone = ball(COLORS.yellow, 1, 0.2);
  drone.position.copy(SPOTS[0]);
  const droneTag = label('ball', COLORS.yellow);
  // Where matrixWorld said the ball was, read on the line right after the move.
  const old = ball(COLORS.gray, 0.5, 0.2);
  const oldTag = label('matrixWorld said', COLORS.gray);
  const gap = line(COLORS.gray, 0.5);
  old.visible = oldTag.visible = gap.visible = false;
  scene.add(drone, droneTag, old, oldTag, gap);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let next = 1;
  let staleSpot = new THREE.Vector3();
  let renderToWaitFor = -1; // the render count that has to pass before matrixWorld is read again

  const show = (afterRender: string) => {
    readout.textContent = [
      `ball.position.set${formatVector(drone.position)}`,
      `ball.matrixWorld, read on the next line   ${formatVector(staleSpot).padEnd(16)} the old spot`,
      `ball.matrixWorld, read after the render   ${afterRender}`,
    ].join('\n');
  };

  const place = () => {
    droneTag.position.copy(drone.position).add(LABEL_LIFT);
  };

  const move = document.createElement('button');
  move.textContent = 'Move it';
  move.addEventListener('click', () => {
    drone.position.copy(SPOTS[next]);
    next = (next + 1) % SPOTS.length;
    staleSpot = spotIn(drone.matrixWorld); // the very next line after the move
    renderToWaitFor = renderer.info.render.frame + 1;

    old.position.copy(staleSpot);
    oldTag.position.copy(staleSpot).add(LABEL_LIFT);
    setLine(gap, staleSpot, drone.position);
    old.visible = oldTag.visible = gap.visible = true;
    place();
    show('waiting for the next render…');
  });
  controlsBar.append(move);

  onFrame(() => {
    if (renderToWaitFor < 0 || renderer.info.render.frame < renderToWaitFor) return;
    renderToWaitFor = -1;
    show(`${formatVector(spotIn(drone.matrixWorld)).padEnd(16)} caught up`);
  });

  place();
  readout.textContent = 'Press Move it.';
};
