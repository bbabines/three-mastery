// The rack moves the child origin; blue must meet the yellow world marker.
import { COLORS } from '@harness/lesson';
import * as THREE from 'three';
import { pointView } from '../../scene-view';
import { worldOrigin } from './drill';

const rack = new THREE.Group();
const part = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.7), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
rack.add(part); part.position.set(0.8, 0.3, -0.4);
const move = (degrees: number) => { rack.position.set(0.5, 0.7, 0.2); rack.rotation.y = THREE.MathUtils.degToRad(degrees); };
const world = (degrees: number) => { move(degrees); return part.position.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), rack.rotation.y).add(rack.position); };
export const demo = pointView('worldOrigin', { label: 'rack turn', min: -150, max: 150, step: 5, value: 50 },
  part.position, (degrees) => { move(degrees); return worldOrigin(part); }, world,
  (scene, degrees) => { if (!rack.parent) scene.add(rack); move(degrees); });
