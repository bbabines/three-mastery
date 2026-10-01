// Yellow is the world ray; blue shows the returned origin and direction.
import { arrow, attempt, ball, COLORS, formatNumber, formatVector, overlay, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { moveRay } from './drill';

const localPoint = new THREE.Vector3(0.4, 0.25, 0.1);
const localDirection = new THREE.Vector3(1, 0.3, 0.2);
const transform = (degrees: number) => new THREE.Matrix4().compose(new THREE.Vector3(0.8, 0.8, -0.5),
  new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(degrees)), new THREE.Vector3(2, 0.7, 1.2));
export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(4.5, 3.5, 5); controls.target.set(0, 1, 0);
  const localModel = new THREE.Mesh(new THREE.BoxGeometry(1, 0.6, 0.6), new THREE.MeshStandardMaterial({ color: COLORS.orange, wireframe: true }));
  localModel.matrixAutoUpdate = false;
  const targetPoint = ball(COLORS.yellow), answerPoint = ball(COLORS.blue);
  const targetRay = arrow(COLORS.yellow), answerRay = arrow(COLORS.blue);
  scene.add(localModel, targetPoint, answerPoint, targetRay, answerRay);
  const readout = overlay(container, 'readout'), bar = overlay(container, 'controls');
  const update = (degrees: number) => {
    const pose = transform(degrees);
    localModel.matrix.copy(pose);
    const wantPoint = localPoint.clone().applyMatrix4(pose);
    const wantDirection = localDirection.clone().transformDirection(pose);
    targetPoint.position.copy(wantPoint); setArrow(targetRay, wantPoint, wantDirection.clone().multiplyScalar(1.3));
    const result = attempt('moveRay', () => moveRay(localPoint.clone(), localDirection.clone(), pose.clone()));
    answerPoint.visible = answerRay.visible = result.ok;
    if (!result.ok) { readout.textContent = result.note; return; }
    answerPoint.position.copy(result.value.point);
    setArrow(answerRay, result.value.point, result.value.direction.clone().multiplyScalar(1.2));
    const gap = result.value.point.distanceTo(wantPoint) + result.value.direction.distanceTo(wantDirection);
    readout.textContent = `origin ${formatVector(result.value.point)}
aim ${formatVector(result.value.direction)}
${gap < 0.01 ? 'ray meets target' : `ray gap ${formatNumber(gap, 2)}`}`;
  };
  slider(bar, 'model turn', { min: -150, max: 150, step: 5, value: 50 }, update); update(50);
};
