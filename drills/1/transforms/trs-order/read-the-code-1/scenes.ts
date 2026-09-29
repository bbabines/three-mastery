// Scenes for the TRS order page. The README places each one with <div data-scene="name">.
import { ball, choiceButtons, COLORS, cornerAngle, formatNumber, formatVector, label, LABEL_LIFT, line, outline, overlay, pointer, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// A flat ring of line, lying level, for showing a path something travels around.
function circle(radius: number, color: string, opacity = 1) {
  const points = Array.from({ length: 65 }, (_, i) => {
    const angle = (i / 64) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
  });
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity }),
  );
}

export const swing: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.8, 5.4, 4.4);
  controls.target.set(0, 0.5, -0.7);

  const RADIUS = 2.2;
  const parent = new THREE.Group();
  parent.position.set(0, 0.9, 0);
  const planet = ball(COLORS.blue, 1, 0.3);
  const path = circle(RADIUS, COLORS.gray, 0.35);
  const start = pointer(COLORS.gray);
  start.material.transparent = true;
  start.material.opacity = 0.3;
  start.position.set(RADIUS, 0, 0);
  // The scene writes this one's matrix itself, the way the readout's code does.
  const mover = pointer(COLORS.yellow);
  mover.matrixAutoUpdate = false;
  const spoke = line(COLORS.yellow, 0.5); // from the parent's origin out to the object
  parent.add(planet, path, start, mover, spoke);

  // Labels live in the scene, so the parent's transform never touches their size.
  const planetTag = label("parent's origin", COLORS.blue);
  planetTag.position.set(0, 1.55, 0);
  const startTag = label('start', COLORS.gray);
  startTag.position.set(RADIUS, 0.45, 0.3); // below the start, so the object's label can pass over it
  const moverTag = label('object', COLORS.yellow);
  scene.add(parent, planetTag, startTag, moverTag);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const move = new THREE.Matrix4().makeTranslation(RADIUS, 0, 0);
  const turn = new THREE.Matrix4();
  const where = new THREE.Vector3();
  let degrees = 90;
  let moveFirst = false;

  const update = () => {
    const radians = THREE.MathUtils.degToRad(degrees);
    turn.makeRotationY(radians);
    mover.matrix.copy(move);
    if (moveFirst) mover.matrix.premultiply(turn);
    else mover.matrix.multiply(turn);
    mover.matrixWorldNeedsUpdate = true;

    where.setFromMatrixPosition(mover.matrix);
    setLine(spoke, new THREE.Vector3(), where);
    moverTag.position.copy(where).add(parent.position).add(LABEL_LIFT);

    const method = moveFirst ? 'premultiply' : 'multiply';
    readout.innerHTML = [
      `turn.makeRotationY(${formatNumber(radians)})   // ${degrees}°`,
      `m.makeTranslation(${RADIUS}, 0, 0).${method}(turn)`,
      `<span style="color:${COLORS.yellow}">object ends up at ${formatVector(where)}</span>, measured from its parent`,
      moveFirst ? "swings around the parent's origin" : 'spins in place at its spot',
    ].join('\n');
  };
  choiceButtons(controlsBar, [
    {
      html: 'Turn, then move',
      select: () => {
        moveFirst = false;
        update();
      },
    },
    {
      html: 'Move, then turn',
      select: () => {
        moveFirst = true;
        update();
      },
    },
  ]);
  slider(controlsBar, 'Turn', { min: 0, max: 360, step: 15, value: degrees }, (value) => {
    degrees = value;
    update();
  });
};

export const stretch: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.3, 2, 4.3);
  controls.target.set(0, 1.4, 0);

  // The holder is a backboard behind the plank, so its own stretch is easy to see.
  const holder = new THREE.Group();
  holder.position.set(0, 1.4, 0);
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 1.1, 0.04),
    new THREE.MeshStandardMaterial({ color: COLORS.gray, transparent: true, opacity: 0.4 }),
  );
  board.position.z = -0.1;
  const plank = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.45, 0.06), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  plank.add(outline(plank.geometry, COLORS.white));
  holder.add(board, plank);

  // The direction the stretch runs, drawn through the plank's middle, just in front of it.
  const stretchLine = line(COLORS.green);
  // The plank tilts up to the right, so the top left and bottom right stay clear for labels.
  const holderTag = label('holder', COLORS.gray);
  holderTag.position.set(-0.95, 2.2, 0);
  const plankTag = label('plank', COLORS.orange);
  plankTag.position.set(0.95, 0.8, 0.1);
  scene.add(holder, stretchLine, holderTag, plankTag);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let amount = 2;
  let tilt = 30;
  let onParent = false;
  const along = new THREE.Vector3();
  const middle = new THREE.Vector3();

  const update = () => {
    plank.rotation.z = THREE.MathUtils.degToRad(tilt);
    plank.scale.set(onParent ? 1 : amount, 1, 1);
    holder.scale.set(onParent ? amount : 1, 1, 1);
    plank.updateWorldMatrix(true, false);

    // The plank's own X after its turn, or the holder's X: whichever the stretch runs along.
    along.set(1, 0, 0);
    if (!onParent) along.applyQuaternion(plank.quaternion);
    plank.getWorldPosition(middle).z += 0.1;
    setLine(stretchLine, middle.clone().addScaledVector(along, -1.4), middle.clone().addScaledVector(along, 1.4));

    const angle = cornerAngle(plank.matrixWorld);
    const square = Math.abs(angle - 90) < 0.05;
    const corners = square ? '90°' : `${formatNumber(Math.min(angle, 180 - angle), 0)}° and ${formatNumber(Math.max(angle, 180 - angle), 0)}°`;
    readout.innerHTML = [
      `${onParent ? 'holder' : 'plank'}.scale.x = ${amount}`,
      `<span style="color:${COLORS.green}">stretch runs along</span>  ${onParent ? "the holder's X" : "the plank's own length"}`,
      `plank's corners     ${corners}   ${square ? 'still square' : 'skewed: shear'}`,
      `plank.scale         ${formatVector(plank.scale, 2)}`,
    ].join('\n');
  };
  choiceButtons(controlsBar, [
    {
      html: '<code>plank.scale.x = s</code>',
      select: () => {
        onParent = false;
        update();
      },
    },
    {
      html: '<code>holder.scale.x = s</code>',
      select: () => {
        onParent = true;
        update();
      },
    },
  ]);
  slider(controlsBar, 'Stretch s', { min: 1, max: 2, step: 0.25, value: amount }, (value) => {
    amount = value;
    update();
  });
  slider(controlsBar, 'Tilt', { min: 0, max: 90, step: 15, value: tilt }, (value) => {
    tilt = value;
    update();
  });
};
