// Yellow marks the saved Euler pose; blue shows the quaternion returned by the drill.
import * as THREE from 'three';
import { poseView } from '../../scene-view';
import { orientationFromEuler } from './drill';

const angles = (degrees: number) => new THREE.Euler(0.45, THREE.MathUtils.degToRad(degrees), -0.3, 'ZXY');
export const demo = poseView('orientationFromEuler', { label: 'middle angle', min: -150, max: 150, step: 5, value: 55 },
  (degrees) => orientationFromEuler(angles(degrees)),
  (degrees) => new THREE.Quaternion().setFromEuler(angles(degrees)));
