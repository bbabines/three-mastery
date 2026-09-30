// Scenes for the Euler angles and order page. The README places each one with <div data-scene="name">.
import { arrow, cameraView, choiceButtons, COLORS, formatNumber, formatVector, label, line, overlay, setArrow, setLine, ship, showCamera, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

type Axis = 'X' | 'Y' | 'Z';
const AXES: Record<Axis, THREE.Vector3> = {
  X: new THREE.Vector3(1, 0, 0),
  Y: new THREE.Vector3(0, 1, 0),
  Z: new THREE.Vector3(0, 0, 1),
};
const AXIS_COLORS: Record<Axis, string> = { X: COLORS.red, Y: COLORS.green, Z: COLORS.blue };

export const steps: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3.3, 2.65, 2.3);
  controls.target.set(0, 1.6, 0);

  const craft = ship(COLORS.yellow);
  craft.position.set(0, 1.6, 0);
  // The ship's own axes ride along as children, so they turn with it.
  for (const key of ['X', 'Y', 'Z'] as const) {
    const own = arrow(AXIS_COLORS[key]);
    setArrow(own, new THREE.Vector3(), AXES[key].clone().multiplyScalar(0.8));
    const tag = label(`own ${key}`, AXIS_COLORS[key]);
    tag.position.copy(AXES[key]).multiplyScalar(1.02);
    craft.add(own, tag);
  }
  // The axis the latest turn went around, drawn through the ship.
  const turnLine = line(COLORS.white, 0.8);
  scene.add(craft, turnLine);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const angles: Record<Axis, number> = { X: -90, Y: 60, Z: 45 };
  let order: 'XYZ' | 'ZYX' = 'XYZ';
  let step = 0;
  const nose = new THREE.Vector3();
  const axis = new THREE.Vector3();

  const update = () => {
    // Each step turns around the ship's own axis, which is what rotateOnAxis does.
    craft.quaternion.identity();
    for (const key of (order.split('') as Axis[]).slice(0, step)) {
      craft.rotateOnAxis(AXES[key], THREE.MathUtils.degToRad(angles[key]));
    }
    nose.set(0, 0, 1).applyQuaternion(craft.quaternion);

    const latest = order[step - 1] as Axis | undefined;
    turnLine.visible = latest !== undefined;
    if (latest) {
      axis.copy(AXES[latest]).applyQuaternion(craft.quaternion);
      setLine(turnLine, craft.position.clone().addScaledVector(axis, -1.8), craft.position.clone().addScaledVector(axis, 1.8));
      (turnLine.material as THREE.LineBasicMaterial).color.set(AXIS_COLORS[latest]);
    }

    const radians = (['X', 'Y', 'Z'] as const).map((key) => formatNumber(THREE.MathUtils.degToRad(angles[key])));
    const what = latest
      ? `step ${step}: turn ${angles[latest]}° around its own <span style="color:${AXIS_COLORS[latest]}">${latest}</span>`
      : 'step 0: no turns yet';
    readout.innerHTML = [
      `ship.rotation.set(${radians.join(', ')}, '${order}')   // ${angles.X}°, ${angles.Y}°, ${angles.Z}°`,
      what + (step === 3 ? ', and the ship matches the line above' : ''),
      `nose (+Z) points ${formatVector(nose, 2)}`,
    ].join('\n');
  };

  choiceButtons(controlsBar, [
    {
      html: "<code>'XYZ'</code>",
      select: () => {
        order = 'XYZ';
        update();
      },
    },
    {
      html: "<code>'ZYX'</code>",
      select: () => {
        order = 'ZYX';
        update();
      },
    },
  ]);
  slider(controlsBar, 'step', { min: 0, max: 3, step: 1, value: step }, (value) => {
    step = value;
    update();
  });
};

export const yawPitch: SceneSetup = (harness) => {
  const { scene, camera, controls, container } = harness;
  camera.position.set(1, 3.6, 4.2);
  controls.target.set(0, 1.2, 0);

  // A second camera, the one being turned. Its picture shows in the corner. A copy with a short
  // reach draws its body and outline, so the outline stays small.
  const eye = new THREE.PerspectiveCamera(65, 1.5, 0.1, 100);
  eye.position.set(0, 1.7, 0);
  const outline = new THREE.PerspectiveCamera(65, 1.5, 0.3, 1.2);
  const helper = showCamera(outline);
  // A wide ground just under the grid: its far edge is the horizon in the camera's picture.
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(40, 64).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: '#272b34' }),
  );
  ground.position.y = -0.02;
  scene.add(eye, outline, helper, ground);
  // Upright posts all around, so a tilted horizon shows in the camera's picture.
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2;
    const post = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 1.6, 0.12),
      new THREE.MeshStandardMaterial({ color: i % 2 ? COLORS.orange : COLORS.blue }),
    );
    post.position.set(Math.cos(angle) * 2.8, 0.8, Math.sin(angle) * 2.8);
    scene.add(post);
  }
  cameraView(harness, eye, [outline, helper]);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let order: 'XYZ' | 'YXZ' = 'XYZ';
  let pitch = -20;
  let yaw = 45;
  const right = new THREE.Vector3();

  const update = () => {
    eye.rotation.set(THREE.MathUtils.degToRad(pitch), THREE.MathUtils.degToRad(yaw), 0, order);
    outline.position.copy(eye.position);
    outline.quaternion.copy(eye.quaternion);
    right.set(1, 0, 0).applyQuaternion(eye.quaternion); // the right edge of its picture
    const tilt = Math.abs(THREE.MathUtils.radToDeg(Math.asin(right.y)));
    readout.innerHTML = [
      `eye.rotation.set(${formatNumber(eye.rotation.x)}, ${formatNumber(eye.rotation.y)}, 0, '${order}')`,
      `// pitch ${pitch}°, yaw ${yaw}°`,
      `eye's own +X  ${formatVector(right, 2)}`,
      tilt > 0.5 ? `<span style="color:${COLORS.orange}">horizon tilted ${formatNumber(tilt, 0)}°: a roll</span>` : 'horizon level',
    ].join('\n');
  };

  choiceButtons(controlsBar, [
    {
      html: "<code>'XYZ'</code>, the default",
      select: () => {
        order = 'XYZ';
        update();
      },
    },
    {
      html: "<code>'YXZ'</code>",
      select: () => {
        order = 'YXZ';
        update();
      },
    },
  ]);
  slider(controlsBar, 'pitch (x)', { min: -40, max: 40, step: 5, value: pitch }, (value) => {
    pitch = value;
    update();
  });
  slider(controlsBar, 'yaw (y)', { min: -90, max: 90, step: 15, value: yaw }, (value) => {
    yaw = value;
    update();
  });
};
