// Yellow shows the part’s forward basis; blue must point the same way at unit length.
import * as THREE from 'three';
import { directionView } from '../../scene-view';
import { forwardFromBasis } from './drill';

const turn = (degrees: number) => new THREE.Quaternion().setFromEuler(new THREE.Euler(0.35, THREE.MathUtils.degToRad(degrees), -0.2));
const basis = (degrees: number) => new THREE.Matrix4().compose(new THREE.Vector3(1, 0, -2), turn(degrees), new THREE.Vector3(2.5, 0.8, 1.7));
export const demo = directionView('forwardFromBasis', { label: 'turn', min: -170, max: 170, step: 5, value: 50 },
  (degrees) => forwardFromBasis(basis(degrees)),
  (degrees) => new THREE.Vector3(0, 0, 1).applyQuaternion(turn(degrees)));
