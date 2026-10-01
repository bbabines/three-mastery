// Gray marks a hit on the moved model; yellow marks its place on the local ghost.
import { COLORS } from '@harness/lesson';
import * as THREE from 'three';
import { pointView } from '../../scene-view';
import { undoTransform } from './drill';

const local = new THREE.Vector3(0.4, 0.2, 0.25);
const pose = (degrees: number) => new THREE.Matrix4().compose(new THREE.Vector3(1.5, 0.9, -0.8),
  new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(degrees)), new THREE.Vector3(1.4, 0.8, 1.1));
const moved = new THREE.Mesh(new THREE.BoxGeometry(1, 0.7, 0.7), new THREE.MeshStandardMaterial({ color: COLORS.orange, wireframe: true }));
const ghost = new THREE.Mesh(new THREE.BoxGeometry(1, 0.7, 0.7), new THREE.MeshStandardMaterial({ color: COLORS.gray, wireframe: true }));
export const demo = pointView('undoTransform', { label: 'model turn', min: -150, max: 150, step: 5, value: 45 },
  (degrees) => local.clone().applyMatrix4(pose(degrees)),
  (degrees) => undoTransform(local.clone().applyMatrix4(pose(degrees)), pose(degrees)), () => local.clone(),
  (scene, degrees) => { if (!moved.parent) scene.add(moved, ghost); moved.matrixAutoUpdate = false; moved.matrix.copy(pose(degrees)); });
