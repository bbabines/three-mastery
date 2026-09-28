// Scenes for the triple product page. The README places each one with <div data-scene="name">.
import { arrow, ball, COLORS, formatNumber, label, line, overlay, setArrow, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const side: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3.5, 2.5, 5);
  controls.target.set(0, 0.5, 0);

  const a = new THREE.Vector3(-1.5, 0.4, 1);
  const b = new THREE.Vector3(1.5, 0.6, 1);
  const c = new THREE.Vector3(0, 0.5, -1.5);
  const center = a.clone().add(b).add(c).divideScalar(3);
  const normal = new THREE.Vector3().crossVectors(b.clone().sub(a), c.clone().sub(a)).normalize();

  const triangle = new THREE.Mesh(
    new THREE.BufferGeometry().setFromPoints([a, b, c]),
    new THREE.MeshBasicMaterial({ color: COLORS.white, transparent: true, opacity: 0.25, side: THREE.DoubleSide }),
  );
  const normalArrow = arrow(COLORS.purple);
  setArrow(normalArrow, center.clone().add(new THREE.Vector3(1, 0, 0)), normal);
  const normalTag = label('normal', COLORS.purple);
  normalTag.position.set(1.2, 1.9, 0.2);
  const aTag = label('a', COLORS.white);
  aTag.position.copy(a).add(new THREE.Vector3(-0.25, 0, 0.2));

  const point = ball(COLORS.green);
  const pointMaterial = point.material as THREE.MeshStandardMaterial;
  const fromA = line(COLORS.gray, 0.6);
  scene.add(triangle, normalArrow, normalTag, aTag, point, fromA);

  const readout = overlay(container, 'readout');
  const update = (height: number) => {
    point.position.copy(center).add(new THREE.Vector3(0, height, 0));
    setLine(fromA, a, point.position);

    const value = normal.dot(point.position.clone().sub(a));
    const where = value > 0.01 ? 'in front: the side the normal faces' : value < -0.01 ? 'behind' : 'on the triangle';
    pointMaterial.color.set(value > 0.01 ? COLORS.green : value < -0.01 ? COLORS.red : COLORS.white);
    readout.textContent = `normal.dot(point − a)  ${formatNumber(value)}\n${where}`;
  };
  slider(overlay(container, 'controls'), 'move the point', { min: -1.5, max: 1.5, step: 0.05, value: 0.8 }, update);
  update(0.8);
};
