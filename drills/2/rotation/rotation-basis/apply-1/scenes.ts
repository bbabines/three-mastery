// Yellow shows the camera’s right basis; blue is the direction read by the drill.
import * as THREE from 'three';
import { directionView } from '../../scene-view';
import { cameraRight } from './drill';

const parentTurn = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0.7, 0.25));
const cameraAt = (degrees: number) => {
  const parent = new THREE.Group();
  parent.quaternion.copy(parentTurn);
  const camera = new THREE.PerspectiveCamera();
  camera.rotation.x = THREE.MathUtils.degToRad(degrees);
  parent.add(camera);
  return camera;
};
export const demo = directionView('cameraRight', { label: 'pitch', min: -90, max: 90, step: 5, value: 80 },
  (degrees) => cameraRight(cameraAt(degrees)),
  () => new THREE.Vector3(1, 0, 0).applyQuaternion(parentTurn));
