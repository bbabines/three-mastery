// A moved rack carries the yellow point; blue must update before a render.
import { COLORS } from '@harness/lesson';
import * as THREE from 'three';
import { pointView } from '../../scene-view';
import { freshWorldPoint } from './drill';

const local = new THREE.Vector3(0.35, 0.2, 0.25);
const rack = new THREE.Group();
const part = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.6), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
rack.add(part); part.position.set(0.7, 0.4, -0.3);
const move = (degrees: number) => { rack.position.set(0.5, 0.6, 0.2); rack.rotation.y = THREE.MathUtils.degToRad(degrees); };
const world = (degrees: number) => { move(degrees); return local.clone().add(part.position).applyAxisAngle(new THREE.Vector3(0, 1, 0), rack.rotation.y).add(rack.position); };
export const demo = pointView('freshWorldPoint', { label: 'rack turn', min: -150, max: 150, step: 5, value: 50 },
  local, (degrees) => { move(degrees); return freshWorldPoint(part, local.clone()); }, world,
  (scene, degrees) => { if (!rack.parent) scene.add(rack); move(degrees); });
