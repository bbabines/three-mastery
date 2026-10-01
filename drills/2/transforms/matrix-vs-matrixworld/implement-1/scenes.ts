// Blue is a corner placed by the saved matrix; yellow marks its live world spot.
import { COLORS } from '@harness/lesson';
import * as THREE from 'three';
import { pointView } from '../../scene-view';
import { worldTransform } from './drill';

const corner = new THREE.Vector3(0.4, 0.3, 0.35);
const rack = new THREE.Group();
const part = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.7), new THREE.MeshStandardMaterial({ color: COLORS.orange, wireframe: true }));
rack.add(part); part.position.set(0.7, 0.25, -0.4); part.rotation.x = 0.3;
const move = (degrees: number) => { rack.position.set(0.6, 0.8, 0.2); rack.rotation.y = THREE.MathUtils.degToRad(degrees); };
const world = (degrees: number) => { move(degrees); return corner.clone().applyEuler(part.rotation).add(part.position).applyAxisAngle(new THREE.Vector3(0, 1, 0), rack.rotation.y).add(rack.position); };
export const demo = pointView('worldTransform', { label: 'rack turn', min: -150, max: 150, step: 5, value: 50 },
  corner, (degrees) => { move(degrees); const matrix = worldTransform(part); return matrix && corner.clone().applyMatrix4(matrix); }, world,
  (scene, degrees) => { if (!rack.parent) scene.add(rack); move(degrees); });
