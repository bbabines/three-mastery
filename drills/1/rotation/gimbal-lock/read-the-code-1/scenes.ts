// Scenes for the gimbal lock page. The README places each one with <div data-scene="name">.
import { ball, COLORS, formatNumber, line, overlay, setLine, ship, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// One ring of a gimbal: a hoop that spins around `axis`, with a pivot at each end of that axis and a
// faint line along it. The hoop stands in a plane that holds the axis, so its spin shows.
function gimbalRing(radius: number, color: string, axis: THREE.Vector3, plane: THREE.Euler) {
  const group = new THREE.Group();
  const hoop = new THREE.Mesh(
    new THREE.TorusGeometry(radius, 0.025, 12, 96),
    new THREE.MeshStandardMaterial({ color }),
  );
  hoop.rotation.copy(plane);
  group.add(hoop);
  for (const side of [-1, 1]) {
    const pivot = ball(color, 1, 0.07);
    pivot.position.copy(axis).multiplyScalar(side * radius);
    group.add(pivot);
  }
  const spindle = line(color, 0.5);
  setLine(spindle, axis.clone().multiplyScalar(-radius - 0.25), axis.clone().multiplyScalar(radius + 0.25));
  group.add(spindle);
  return group;
}

export const rings: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(4.2, 4.1, 4);
  controls.target.set(0, 2, 0);

  // The rings nest like the three turns of 'YXZ': yaw outside, then pitch, then roll, then the ship.
  const yawRing = gimbalRing(1.5, COLORS.green, new THREE.Vector3(0, 1, 0), new THREE.Euler(0, 0, 0));
  yawRing.position.set(0, 1.75, 0);
  const pitchRing = gimbalRing(1.25, COLORS.red, new THREE.Vector3(1, 0, 0), new THREE.Euler(Math.PI / 2, 0, 0));
  const rollRing = gimbalRing(1, COLORS.blue, new THREE.Vector3(0, 0, 1), new THREE.Euler(0, Math.PI / 2, 0));
  const craft = ship(COLORS.yellow);
  yawRing.add(pitchRing);
  pitchRing.add(rollRing);
  rollRing.add(craft);
  scene.add(yawRing);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  const degrees = { yaw: 30, pitch: 45, roll: 0 };
  const rollAxis = new THREE.Vector3();

  const update = () => {
    yawRing.rotation.y = THREE.MathUtils.degToRad(degrees.yaw);
    pitchRing.rotation.x = THREE.MathUtils.degToRad(degrees.pitch);
    rollRing.rotation.z = THREE.MathUtils.degToRad(degrees.roll);
    rollRing.updateWorldMatrix(true, false);
    rollAxis.set(0, 0, 1).transformDirection(rollRing.matrixWorld);
    const apart = THREE.MathUtils.radToDeg(rollAxis.angleTo(THREE.Object3D.DEFAULT_UP));
    const gap = Math.min(apart, 180 - apart);

    const [x, y, z] = [degrees.pitch, degrees.yaw, degrees.roll].map((value) => formatNumber(THREE.MathUtils.degToRad(value)));
    const locked = gap < 0.5;
    readout.innerHTML = [
      `ship.rotation.set(${x}, ${y}, ${z}, 'YXZ')`,
      `// pitch ${degrees.pitch}°, yaw ${degrees.yaw}°, roll ${degrees.roll}°`,
      locked
        ? `<span style="color:${COLORS.orange}">roll axis lines up with the yaw axis: gimbal lock</span>`
        : `<span style="color:${COLORS.blue}">roll axis</span> is ${formatNumber(gap, 0)}° from the <span style="color:${COLORS.green}">yaw axis</span>`,
      locked ? 'Yaw and Roll now spin the ship around the same line.' : 'Yaw and Roll turn the ship different ways.',
    ].join('\n');
  };
  slider(sliders, 'Yaw', { min: -90, max: 90, step: 15, value: degrees.yaw }, (value) => {
    degrees.yaw = value;
    update();
  });
  slider(sliders, 'Pitch', { min: -90, max: 90, step: 15, value: degrees.pitch }, (value) => {
    degrees.pitch = value;
    update();
  });
  slider(sliders, 'Roll', { min: -90, max: 90, step: 15, value: degrees.roll }, (value) => {
    degrees.roll = value;
    update();
  });
  update();
};
