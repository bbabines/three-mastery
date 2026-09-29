// Scenes for the lookAt and the up vector page. The README places each one with <div data-scene="name">.
import {
  arrow,
  ball,
  cameraView,
  choiceButtons,
  COLORS,
  formatNumber,
  formatVector,
  label,
  LABEL_LIFT,
  line,
  overlay,
  pointer,
  setArrow,
  setLine,
  showCamera,
  slider,
} from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// A blue arrow along an object's own +Z, riding along as a child.
function plusZ(object: THREE.Object3D, length = 0.9) {
  const helper = arrow(COLORS.blue);
  setArrow(helper, new THREE.Vector3(), new THREE.Vector3(0, 0, length));
  object.add(helper);
}

export const facing: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.4, 3.3, 4.3);
  controls.target.set(0, 1, -0.5);

  const turret = pointer(COLORS.yellow);
  turret.position.set(-1.4, 1.2, 0.6);
  plusZ(turret);
  const eye = new THREE.PerspectiveCamera(40, 1.4, 0.2, 0.8);
  eye.position.set(1.4, 1.2, 0.6);
  const outline = showCamera(eye);
  plusZ(eye);
  const target = ball(COLORS.orange);
  const turretTag = label('turret', COLORS.yellow);
  turretTag.position.copy(turret.position).add(LABEL_LIFT);
  const eyeTag = label('camera', COLORS.gray);
  eyeTag.position.copy(eye.position).add(LABEL_LIFT);
  const ballTag = label('ball', COLORS.orange);
  const toTurret = line(COLORS.yellow, 0.4);
  const toEye = line(COLORS.gray, 0.4);
  scene.add(turret, eye, outline, target, turretTag, eyeTag, ballTag, toTurret, toEye);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  let x = 0.5;

  const update = () => {
    target.position.set(x, 0.6, -1.8);
    ballTag.position.copy(target.position).add(LABEL_LIFT);
    turret.lookAt(target.position);
    eye.lookAt(target.position);
    setLine(toTurret, turret.position, target.position);
    setLine(toEye, eye.position, target.position);
    readout.innerHTML = [
      'turret.lookAt(ball.position)',
      'camera.lookAt(ball.position)',
      `<span style="color:${COLORS.blue}">+Z</span>: the turret's points at the ball, the camera's points away`,
    ].join('\n');
  };
  slider(sliders, 'Move ball', { min: -2.5, max: 2.5, step: 0.25, value: x }, (value) => {
    x = value;
    update();
  });
  update();
};

// A flat arrow on the floor pointing to −Z, "north" on the plan, with a few colored rooms around it.
function floorPlan() {
  const plan = new THREE.Group();
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.9);
  shape.lineTo(0.35, 0.3);
  shape.lineTo(0.12, 0.3);
  shape.lineTo(0.12, -0.7);
  shape.lineTo(-0.12, -0.7);
  shape.lineTo(-0.12, 0.3);
  shape.lineTo(-0.35, 0.3);
  shape.closePath();
  const north = new THREE.Mesh(new THREE.ShapeGeometry(shape).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: COLORS.white }));
  north.position.y = 0.05;
  plan.add(north);
  const rooms: [number, number, string][] = [
    [-1.3, -1.3, COLORS.red],
    [1.3, -1.3, COLORS.green],
    [-1.3, 1.3, COLORS.blue],
    [1.3, 1.3, COLORS.purple],
  ];
  for (const [x, z, color] of rooms) {
    const room = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color }));
    room.position.set(x, 0.04, z);
    plan.add(room);
  }
  const tag = label('N', COLORS.white);
  tag.position.set(0, 0.3, -1.15);
  plan.add(tag);
  return plan;
}

export const upHint: SceneSetup = (harness) => {
  const { scene, camera, controls, container } = harness;
  camera.position.set(4.3, 5, 4.6);
  controls.target.set(-0.3, 1.45, 0.2);

  // The camera being aimed, and a copy with a short reach that draws its body and outline.
  const eye = new THREE.PerspectiveCamera(60, 1.5, 0.1, 20);
  eye.position.set(0, 3, 0);
  const outline = new THREE.PerspectiveCamera(60, 1.5, 0.2, 0.7);
  const helper = showCamera(outline);
  const topArrow = arrow(COLORS.green); // the camera's own +Y: the top of its picture
  setArrow(topArrow, new THREE.Vector3(), new THREE.Vector3(0, 0.7, 0));
  outline.add(topArrow);
  const target = ball(COLORS.orange);
  scene.add(floorPlan(), eye, outline, helper, target);
  cameraView(harness, eye, [outline, helper]);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const ups = [new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, -1)];
  let up = ups[0];
  let z = 0.5;
  const look = new THREE.Vector3();
  const top = new THREE.Vector3();

  const update = () => {
    target.position.set(0, 0.17, z);
    eye.up.copy(up);
    eye.lookAt(target.position);
    outline.position.copy(eye.position);
    outline.quaternion.copy(eye.quaternion);

    eye.getWorldDirection(look);
    top.set(0, 1, 0).applyQuaternion(eye.quaternion);
    const angle = THREE.MathUtils.radToDeg(look.angleTo(up));
    const parallel = Math.min(angle, 180 - angle) < 15;
    const heading = top.z < -0.01 ? 'north, the plan reads upright' : top.z > 0.01 ? 'south, the plan is upside down' : 'sideways';
    readout.innerHTML = [
      `eye.up.set(${formatVector(up, 0).slice(1, -1)}); eye.lookAt(ball.position)`,
      `up to the look direction: ${formatNumber(angle, 0)}°${parallel ? ', nearly parallel' : ''}`,
      `<span style="color:${COLORS.green}">top of the picture</span> points ${heading}`,
    ].join('\n');
  };
  choiceButtons(
    controlsBar,
    ups.map((choice) => ({
      html: `<code>up = ${formatVector(choice, 0)}</code>`,
      select: () => {
        up = choice;
        update();
      },
    })),
  );
  slider(controlsBar, 'Ball z', { min: -1.5, max: 1.5, step: 0.25, value: z }, (value) => {
    z = value;
    update();
  });
};

export const spot: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(1.4, 3.9, 5.6);
  controls.target.set(0, 1.5, -0.4);
  scene.children.find((child) => child instanceof THREE.HemisphereLight)!.intensity = 0.35;

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(9, 9).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#b8bcc4' }));
  floor.position.y = 0.01;
  const lamp = new THREE.SpotLight(0xffffff, 6, 0, Math.PI / 10, 0.35, 0);
  lamp.position.set(0, 2.7, 0);
  // The lamp's housing points along its −Z, the side lookAt turns toward a point for lights. A glow
  // keeps it and the ball easy to see in the dim room.
  const housing = pointer(COLORS.yellow, 0.7);
  housing.material.emissive.set(COLORS.yellow);
  housing.material.emissiveIntensity = 0.6;
  housing.rotation.y = Math.PI;
  lamp.add(housing);
  const lampTag = label('spot light', COLORS.yellow);
  lampTag.position.set(-0.9, 2.8, 0);
  const target = ball(COLORS.orange);
  target.material.emissive.set(COLORS.orange);
  target.material.emissiveIntensity = 0.6;
  const beam = line(COLORS.white, 0.5); // from the lamp to where it really shines
  scene.add(floor, lamp, lamp.target, lampTag, target, beam);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let useTarget = false;
  let x = 1.5;
  const shinesAt = new THREE.Vector3();

  const update = () => {
    target.position.set(x, 0.17, -0.6);
    if (useTarget) {
      lamp.rotation.set(0, 0, 0);
      lamp.target.position.copy(target.position);
    } else {
      lamp.target.position.set(0, 0, 0);
      lamp.lookAt(target.position);
    }
    lamp.target.updateMatrixWorld();
    shinesAt.setFromMatrixPosition(lamp.target.matrixWorld);
    setLine(beam, lamp.position, shinesAt);

    readout.innerHTML = useTarget
      ? [
          'spot.target.position.copy(ball.position)',
          "spot's rotation: untouched",
          `shines at ${formatVector(shinesAt)}: the ball`,
        ].join('\n')
      : [
          'spot.lookAt(ball.position)',
          "spot's rotation: turned toward the ball",
          `<span style="color:${COLORS.orange}">shines at ${formatVector(shinesAt)}: its target, straight below</span>`,
        ].join('\n');
  };
  choiceButtons(controlsBar, [
    {
      html: '<code>spot.lookAt(ball.position)</code>',
      select: () => {
        useTarget = false;
        update();
      },
    },
    {
      html: '<code>spot.target.position.copy(ball.position)</code>',
      select: () => {
        useTarget = true;
        update();
      },
    },
  ]);
  slider(controlsBar, 'Move ball', { min: -2, max: 2, step: 0.25, value: x }, (value) => {
    x = value;
    update();
  });
};
