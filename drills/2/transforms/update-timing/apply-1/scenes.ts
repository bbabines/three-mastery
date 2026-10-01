// The yellow bounds center moves with the rack before a render; blue should follow.
import { COLORS } from '@harness/lesson';
import * as THREE from 'three';
import { pointView } from '../../scene-view';
import { freshBoundsCenter } from './drill';

const center = new THREE.Vector3(0.2, 0.1, 0.15);
const rack = new THREE.Group();
const part = new THREE.Mesh(new THREE.BoxGeometry(1, 0.7, 0.8), new THREE.MeshStandardMaterial({ color: COLORS.orange, wireframe: true }));
rack.add(part); part.position.set(0.65, 0.4, -0.2);
const move = (degrees: number) => { rack.position.set(0.4, 0.7, 0.2); rack.rotation.y = THREE.MathUtils.degToRad(degrees); };
const world = (degrees: number) => { move(degrees); return center.clone().add(part.position).applyAxisAngle(new THREE.Vector3(0, 1, 0), rack.rotation.y).add(rack.position); };
export const demo = pointView('freshBoundsCenter', { label: 'rack turn', min: -150, max: 150, step: 5, value: 50 },
  center, (degrees) => { move(degrees); return freshBoundsCenter(part, center.clone()); }, world,
  (scene, degrees) => { if (!rack.parent) scene.add(rack); move(degrees); });
