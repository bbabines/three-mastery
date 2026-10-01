// Imported angles use ZXY order; the blue pose should meet the yellow imported pose.
import * as THREE from 'three';
import { poseView } from '../../scene-view';
import { importTurn } from './drill';

const angles = (degrees: number) => new THREE.Vector3(0.6, THREE.MathUtils.degToRad(degrees), -0.5);
export const demo = poseView('importTurn ZXY', { label: 'middle angle', min: -150, max: 150, step: 5, value: 50 },
  (degrees) => importTurn(angles(degrees), 'ZXY'),
  (degrees) => new THREE.Quaternion().setFromEuler(new THREE.Euler(...angles(degrees).toArray().slice(0, 3) as [number, number, number], 'ZXY')));
