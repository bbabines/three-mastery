// The yellow pose turns around a fixed parent axis; blue shows the returned pose.
import * as THREE from 'three';
import { poseView } from '../../scene-view';
import { parentDelta } from './drill';

const orientation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.35, 0.65, -0.2));
const axis = new THREE.Vector3(0, 2, 1);
export const demo = poseView('parentDelta', { label: 'parent turn', min: -170, max: 170, step: 5, value: 55 },
  (degrees) => parentDelta(orientation.clone(), axis.clone(), THREE.MathUtils.degToRad(degrees)),
  (degrees) => orientation.clone().premultiply(new THREE.Quaternion().setFromAxisAngle(axis.clone().normalize(), THREE.MathUtils.degToRad(degrees))));
