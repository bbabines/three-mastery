// Blue shows the blended camera pose; yellow marks the shortest-turn target.
import * as THREE from 'three';
import { poseView } from '../../scene-view';
import { smoothOrientation } from './drill';

const start = new THREE.Quaternion().setFromEuler(new THREE.Euler(-1.35, -0.5, 0.2, 'YXZ'));
const end = new THREE.Quaternion().setFromEuler(new THREE.Euler(-1.4, 1.8, -0.3, 'YXZ'));
export const demo = poseView('smoothOrientation', { label: 'fraction', min: 0, max: 1, step: 0.05, value: 0.45 },
  (fraction) => smoothOrientation(start.clone(), end.clone(), fraction),
  (fraction) => start.clone().slerp(end, fraction), new THREE.Vector3(0, 0, -1));
