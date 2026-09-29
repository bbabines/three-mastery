// Scenes for the slerp page. The README places each one with <div data-scene="name">.
import { ball, choiceButtons, COLORS, formatNumber, label, LABEL_LIFT, overlay, ship, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const blend: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 2.9, 3.6);
  controls.target.set(0, 1.45, 0);

  const d = THREE.MathUtils.degToRad;
  const startAngles = new THREE.Euler(d(-30), d(150), 0);
  const endAngles = new THREE.Euler(d(30), d(-150), 0);
  const start = new THREE.Quaternion().setFromEuler(startAngles);
  const end = new THREE.Quaternion().setFromEuler(endAngles);
  const total = THREE.MathUtils.radToDeg(start.angleTo(end));

  const center = new THREE.Vector3(0, 1.5, 0);
  const startGhost = ship(COLORS.gray, 0.45);
  startGhost.position.set(-2, 1.5, 0);
  startGhost.quaternion.copy(start);
  const endGhost = ship(COLORS.blue, 0.45);
  endGhost.position.set(2, 1.5, 0);
  endGhost.quaternion.copy(end);
  const startTag = label('start', COLORS.gray);
  startTag.position.copy(startGhost.position).add(LABEL_LIFT).add(LABEL_LIFT);
  const endTag = label('end', COLORS.blue);
  endTag.position.copy(endGhost.position).add(LABEL_LIFT).add(LABEL_LIFT);
  const craft = ship(COLORS.yellow);
  craft.position.copy(center);

  // The path the nose tip takes from t = 0 to 1, and where it is now.
  const SAMPLES = 60;
  const path = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(Array.from({ length: SAMPLES + 1 }, () => new THREE.Vector3())),
    new THREE.LineBasicMaterial({ color: COLORS.orange }),
  );
  path.frustumCulled = false;
  const tip = ball(COLORS.orange, 1, 0.06);
  scene.add(startGhost, endGhost, startTag, endTag, craft, path, tip);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let byAngles = false;
  let t = 0.5;
  const turn = new THREE.Quaternion();
  const nose = new THREE.Vector3();

  const turnAt = (amount: number, target: THREE.Quaternion) => {
    if (!byAngles) return target.slerpQuaternions(start, end, amount);
    const lerp = THREE.MathUtils.lerp;
    return target.setFromEuler(new THREE.Euler(lerp(startAngles.x, endAngles.x, amount), lerp(startAngles.y, endAngles.y, amount), 0));
  };

  const update = () => {
    const positions = path.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i <= SAMPLES; i++) {
      turnAt(i / SAMPLES, turn);
      nose.set(0, 0, 0.75).applyQuaternion(turn).add(center);
      positions.setXYZ(i, nose.x, nose.y, nose.z);
    }
    positions.needsUpdate = true;

    turnAt(t, craft.quaternion);
    tip.position.set(0, 0, 0.75).applyQuaternion(craft.quaternion).add(center);
    const turned = THREE.MathUtils.radToDeg(start.angleTo(craft.quaternion));

    readout.innerHTML = [
      byAngles
        ? `ship.rotation.set(lerp(-0.52, 0.52, ${t}), lerp(2.62, -2.62, ${t}), 0)`
        : `ship.quaternion.slerpQuaternions(start, end, ${t})`,
      `start to end: ${formatNumber(total, 0)}° the short way`,
      `<span style="color:${COLORS.orange}">turned from start so far: ${formatNumber(turned, 0)}°</span>${byAngles && turned > total + 1 ? ', the long way round' : ''}`,
    ].join('\n');
  };
  choiceButtons(controlsBar, [
    {
      html: '<code>slerp</code>',
      select: () => {
        byAngles = false;
        update();
      },
    },
    {
      html: 'lerp the angles',
      select: () => {
        byAngles = true;
        update();
      },
    },
  ]);
  slider(controlsBar, 't', { min: 0, max: 1, step: 0.05, value: t }, (value) => {
    t = value;
    update();
  });
};
