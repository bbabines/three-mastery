// The white tip crosses the part as scale changes sign; the readout flags a mirror.
import { ball, COLORS } from '@harness/lesson';
import * as THREE from 'three';
import { flagView } from '../../scene-view';
import { isMirroredPose } from './drill';

const matrix = (scaleX: number) => new THREE.Matrix4().compose(
  new THREE.Vector3(0, 1, 0), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.5), new THREE.Vector3(scaleX, 1, 0.8));
const part = new THREE.Mesh(new THREE.BoxGeometry(1, 0.6, 0.6), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
const tip = ball(COLORS.white, 1, 0.11);
tip.position.x = 0.7;
part.add(tip);
export const demo = flagView('isMirroredPose', { label: 'x scale', min: -2, max: 2, step: 1, value: -1 },
  (scaleX) => isMirroredPose(matrix(scaleX)), (scaleX) => scaleX < 0,
  (scene, scaleX) => { if (!part.parent) scene.add(part); part.matrixAutoUpdate = false; part.matrix.copy(matrix(scaleX)); });
