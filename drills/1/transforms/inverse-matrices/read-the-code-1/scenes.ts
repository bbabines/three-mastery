// Scenes for the inverse matrices page. The README places each one with <div data-scene="name">.
import { ball, choiceButtons, COLORS, formatNumber, formatVector, label, LABEL_LIFT, line, overlay, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// Calls `onClick` with the pointer's spot on the canvas, from −1 to 1 on each axis (what
// `raycaster.setFromCamera` wants), when the canvas is clicked without dragging. Dragging
// orbits the camera, so it shouldn't count as a click.
function onCanvasClick(canvas: HTMLCanvasElement, onClick: (pointer: THREE.Vector2) => void) {
  const down = new THREE.Vector2();
  canvas.addEventListener('pointerdown', (event) => down.set(event.clientX, event.clientY));
  canvas.addEventListener('pointerup', (event) => {
    if (down.distanceTo(new THREE.Vector2(event.clientX, event.clientY)) > 4) return;
    const rect = canvas.getBoundingClientRect();
    onClick(
      new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      ),
    );
  });
}

// Shows each of a vector's three numbers in the color of the axis it's measured along.
const axisColored = (v: THREE.Vector3) =>
  `(<span style="color:${COLORS.red}">${formatNumber(v.x)}</span>, ` +
  `<span style="color:${COLORS.green}">${formatNumber(v.y)}</span>, ` +
  `<span style="color:${COLORS.blue}">${formatNumber(v.z)}</span>)`;

export const clickPanel: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(0.6, 2, 3.4);
  controls.target.set(0, 1.1, -0.3);

  // The panel's origin is the center of its board.
  const panel = new THREE.Group();
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1, 0.06), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  const button = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.06, 24).rotateX(Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: COLORS.red }),
  );
  button.position.set(0.4, 0.2, 0.06);
  const panelTag = label('panel', COLORS.gray);
  panelTag.position.set(-0.45, 0.7, 0);
  const marker = ball(COLORS.yellow, 1, 0.04);
  // Inside the panel, so they run along its own X, Y, and Z: the numbers worldToLocal gives back.
  const alongZ = line(COLORS.blue);
  const alongX = line(COLORS.red);
  const alongY = line(COLORS.green);
  panel.add(board, button, panelTag, marker, alongZ, alongX, alongY);
  scene.add(panel);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  const raycaster = new THREE.Raycaster();
  const onPanel = new THREE.Vector3(0.4, 0.2, 0.09); // starts on the red button's face
  const values = { turn: 30, x: 0 };
  let status = 'Click anywhere on the panel.';

  const update = () => {
    panel.position.set(values.x, 1.1, -0.3);
    panel.rotation.y = THREE.MathUtils.degToRad(values.turn);
    panel.updateMatrixWorld(); // the scene reads matrixWorld before the next render refreshes it

    // Where that spot on the panel is in the world now: the hit point a click there would give.
    const hitPoint = panel.localToWorld(onPanel.clone());
    marker.position.copy(onPanel);
    // Lifted just off the board's face so the lines don't hide in it.
    const lineZ = onPanel.z + (onPanel.z < 0 ? -0.01 : 0.01);
    setLine(alongZ, new THREE.Vector3(), new THREE.Vector3(0, 0, lineZ));
    setLine(alongX, new THREE.Vector3(0, 0, lineZ), new THREE.Vector3(onPanel.x, 0, lineZ));
    setLine(alongY, new THREE.Vector3(onPanel.x, 0, lineZ), new THREE.Vector3(onPanel.x, onPanel.y, lineZ));

    readout.innerHTML = [
      `<span style="color:${COLORS.yellow}">●</span> hit.point  ${formatVector(hitPoint, 2)}  in the world`,
      `<span style="color:${COLORS.yellow}">●</span> panel.worldToLocal(hit.point.clone())`,
      `    ${axisColored(onPanel)}  measured from the panel itself`,
      status,
    ].join('\n');
  };

  onCanvasClick(renderer.domElement, (pointerSpot) => {
    raycaster.setFromCamera(pointerSpot, camera);
    const hit = raycaster.intersectObjects([board, button])[0];
    if (!hit) return;
    onPanel.copy(panel.worldToLocal(hit.point.clone()));
    status = 'Now turn or move the panel.';
    update();
  });

  const moved = () => {
    status = 'The same spot: new world numbers, same panel numbers.';
    update();
  };
  slider(sliders, 'Turn panel', { min: -90, max: 90, step: 15, value: values.turn }, (value) => {
    values.turn = value;
    moved();
  });
  slider(sliders, 'Move panel', { min: -1, max: 1, step: 0.5, value: values.x }, (value) => {
    values.x = value;
    moved();
  });
  update();
};

// A sticker on the sign's board, measured from the sign itself.
const STICKER = new THREE.Vector3(0.3, 1.35, 0.05);

export const invertVsTranspose: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(1.1, 2.3, 4.6);
  controls.target.set(0.6, 1.4, 0);

  // The sign's origin is at the foot of its post, so with no move it sits at the world's origin
  // and its matrixWorld only turns and resizes.
  const sign = new THREE.Group();
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  post.position.y = 0.5;
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 0.06), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  board.position.y = 1.3;
  const sticker = ball(COLORS.yellow, 1, 0.06);
  sticker.position.copy(STICKER);
  const stickerTag = label('sticker', COLORS.yellow);
  stickerTag.position.copy(STICKER).add(LABEL_LIFT);
  // Drawn inside the sign: the undone numbers, read as a spot measured from the sign itself.
  const undone = ball(COLORS.orange, 0.55, 0.11);
  sign.add(post, board, sticker, stickerTag, undone);
  scene.add(sign);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const values = { turn: 30, move: 0, size: 1 };
  let useInvert = true;

  const update = () => {
    sign.position.set(values.move, 0, 0);
    sign.rotation.y = THREE.MathUtils.degToRad(values.turn);
    sign.scale.setScalar(values.size);
    sign.updateMatrixWorld(); // the scene reads matrixWorld before the next render refreshes it

    const world = STICKER.clone().applyMatrix4(sign.matrixWorld);
    const undo = useInvert ? sign.matrixWorld.clone().invert() : sign.matrixWorld.clone().transpose();
    const back = world.clone().applyMatrix4(undo);
    undone.position.copy(back);
    const found = back.distanceTo(STICKER) < 1e-6;

    readout.innerHTML = [
      `<span style="color:${COLORS.yellow}">●</span> sticker  ${formatVector(STICKER, 2)}  measured from the sign itself`,
      `world = sticker.clone().applyMatrix4(sign.matrixWorld)`,
      `<span style="color:${COLORS.orange}">●</span> back = world.clone().applyMatrix4(sign.matrixWorld.clone().${useInvert ? 'invert' : 'transpose'}())`,
      `    ${formatVector(back, 2).padEnd(20)} ${found ? 'back on the sticker' : 'misses the sticker'}`,
    ].join('\n');
  };

  choiceButtons(controlsBar, [
    {
      html: '<code>invert()</code>',
      select: () => {
        useInvert = true;
        update();
      },
    },
    {
      html: '<code>transpose()</code>',
      select: () => {
        useInvert = false;
        update();
      },
    },
  ]);
  slider(controlsBar, 'Turn', { min: -180, max: 180, step: 15, value: values.turn }, (value) => {
    values.turn = value;
    update();
  });
  slider(controlsBar, 'Move', { min: 0, max: 1.5, step: 0.25, value: values.move }, (value) => {
    values.move = value;
    update();
  });
  slider(controlsBar, 'Size', { min: 0.5, max: 1.25, step: 0.25, value: values.size }, (value) => {
    values.size = value;
    update();
  });
};
