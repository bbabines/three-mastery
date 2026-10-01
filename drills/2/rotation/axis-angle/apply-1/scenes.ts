// The orange line is the tilted hinge; the blue point should meet the yellow target.
import * as THREE from 'three';
import { pointView } from '../../scene-view';
import { orbitOnAxis } from './drill';

const point = new THREE.Vector3(1.8, 1, 0.5);
const center = new THREE.Vector3(-0.6, 0.8, -0.4);
const axis = new THREE.Vector3(1, 2, 1);
export const demo = pointView('orbitOnAxis', point, center, axis,
  (angle) => orbitOnAxis(point.clone(), center.clone(), axis.clone(), angle),
  (angle) => point.clone().sub(center).applyAxisAngle(axis.clone().normalize(), angle).add(center));
