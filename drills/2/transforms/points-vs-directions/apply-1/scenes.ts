// The blue velocity keeps the part’s scale; yellow shows the correct world velocity.
import { COLORS } from '@harness/lesson';
import * as THREE from 'three';
import { vectorView } from '../../scene-view';
import { worldVelocity } from './drill';

const local = new THREE.Vector3(0.65, 0.3, 0.1);
const part = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 0.6), new THREE.MeshStandardMaterial({ color: COLORS.orange, wireframe: true }));
const turn = (degrees: number) => new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(degrees));
const pose = (degrees: number) => new THREE.Matrix4().compose(new THREE.Vector3(2, 1, -1), turn(degrees), new THREE.Vector3(2, 0.6, 1.4));
export const demo = vectorView('worldVelocity', { label: 'part turn', min: -150, max: 150, step: 5, value: 50 },
  (degrees) => worldVelocity(local.clone(), pose(degrees)),
  (degrees) => local.clone().multiply(new THREE.Vector3(2, 0.6, 1.4)).applyQuaternion(turn(degrees)),
  (scene, degrees) => { if (!part.parent) scene.add(part); part.matrixAutoUpdate = false; part.matrix.copy(pose(degrees)); });
