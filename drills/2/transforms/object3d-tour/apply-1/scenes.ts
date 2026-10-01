// Blue is the returned world position; the yellow mark stays under the reparented part.
import { COLORS } from '@harness/lesson';
import * as THREE from 'three';
import { pointView } from '../../scene-view';
import { keepWorldOnAttach } from './drill';

const oldParent = new THREE.Group();
const newParent = new THREE.Group();
const part = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.5, 0.6), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
const local = new THREE.Vector3(0.55, 0.3, -0.2);
const reset = (degrees: number) => {
  oldParent.position.set(-0.5, 0.8, 0.2); oldParent.rotation.y = THREE.MathUtils.degToRad(degrees);
  newParent.position.set(1.3, 0.5, -0.4); newParent.rotation.y = -0.5;
  oldParent.add(part); part.position.copy(local); part.rotation.set(0, 0, 0);
};
const world = (degrees: number) => { reset(degrees); return local.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), oldParent.rotation.y).add(oldParent.position); };
export const demo = pointView('keepWorldOnAttach', { label: 'old group turn', min: -150, max: 150, step: 5, value: 45 },
  local, (degrees) => { reset(degrees); return keepWorldOnAttach(part, newParent); }, world,
  (scene, degrees) => { if (!oldParent.parent) scene.add(oldParent, newParent); reset(degrees); });
