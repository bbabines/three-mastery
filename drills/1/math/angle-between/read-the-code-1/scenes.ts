// Scenes for the angle page. The README places each one with <div data-scene="name">.
import { ball, choiceButtons, COLORS, formatNumber, label, line, overlay, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const UP = new THREE.Vector3(0, 1, 0);

// A cone whose tip points along +Z, the side lookAt and rotation turn toward.
function pointer(color: string) {
  return new THREE.Mesh(
    new THREE.ConeGeometry(0.22, 0.8, 24).rotateX(Math.PI / 2),
    new THREE.MeshStandardMaterial({ color }),
  );
}

function signedAngle(forward: THREE.Vector3, toTarget: THREE.Vector3) {
  const cross = new THREE.Vector3().crossVectors(forward, toTarget);
  return Math.atan2(cross.dot(UP), forward.dot(toTarget));
}

export const turn: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 6, 4);
  controls.target.set(0, 0, -0.5);

  const center = new THREE.Vector3(0, 0.3, 0);
  const forward = new THREE.Vector3(0, 0, -1);

  const turret = pointer(COLORS.yellow);
  turret.position.copy(center);
  turret.lookAt(center.clone().add(forward));
  const forwardLine = line(COLORS.yellow, 0.4);
  setLine(forwardLine, center, center.clone().addScaledVector(forward, 3));
  const forwardTag = label('forward', COLORS.yellow);
  forwardTag.position.set(0, 0.6, -3.2);

  const target = ball(COLORS.red);
  const aimLine = line(COLORS.red, 0.7);
  scene.add(turret, forwardLine, forwardTag, target, aimLine);

  const readout = overlay(container, 'readout');
  const update = (degrees: number) => {
    const direction = forward.clone().applyAxisAngle(UP, THREE.MathUtils.degToRad(degrees));
    target.position.copy(center).addScaledVector(direction, 2.5);
    setLine(aimLine, center, target.position);

    const toTarget = target.position.clone().sub(center);
    const angle = forward.angleTo(toTarget);
    const signed = signedAngle(forward, toTarget);
    const side = Math.abs(signed) < 1e-6 ? 'straight ahead' : signed > 0 ? 'turn left' : 'turn right';
    readout.innerHTML = [
      `forward.angleTo(toTarget)  ${formatNumber(angle)} rad = ${formatNumber(THREE.MathUtils.radToDeg(angle), 0)}°   no side`,
      `signed angle               ${formatNumber(THREE.MathUtils.radToDeg(signed), 0)}°   ${side}`,
    ].join('\n');
  };
  slider(overlay(container, 'controls'), 'move target', { min: -180, max: 180, step: 5, value: 45 }, update);
  update(45);
};

export const radians: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 5, 3.5);
  controls.target.set(0, 0, -0.3);

  const start = pointer(COLORS.gray);
  start.material.opacity = 0.35;
  start.material.transparent = true;
  const mesh = pointer(COLORS.yellow);
  const startTag = label('start', COLORS.gray);
  startTag.position.set(0, 0.5, 0.9);
  const quarter = label('a quarter turn', COLORS.green);
  quarter.position.set(1.4, 0.5, 0);
  scene.add(start, mesh, startTag, quarter);

  const readout = overlay(container, 'readout');
  const show = (rotation: number, text: string) => {
    mesh.rotation.y = rotation;
    const degrees = THREE.MathUtils.radToDeg(rotation) % 360;
    readout.textContent = `${text}\nends up ${formatNumber(degrees, 0)}° around${rotation === 90 ? ', after 14 full spins' : ''}`;
  };
  choiceButtons(overlay(container, 'controls'), [
    {
      html: '<code>mesh.rotation.y = MathUtils.degToRad(90)</code>',
      select: () => show(THREE.MathUtils.degToRad(90), 'A quarter turn.'),
    },
    { html: '<code>mesh.rotation.y = 90</code>', select: () => show(90, '90 radians, not 90 degrees.') },
  ]);
};
