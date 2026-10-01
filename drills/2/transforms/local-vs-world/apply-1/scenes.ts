// A yellow mount moves with the rack; the blue light should follow it.
import { COLORS } from '@harness/lesson';
import * as THREE from 'three';
import { pointView } from '../../scene-view';
import { lightWorld } from './drill';

const mount = new THREE.Vector3(0.55, 0.35, 0.2);
const rack = new THREE.Group();
const part = new THREE.Mesh(new THREE.BoxGeometry(1, 0.6, 0.6), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
rack.add(part);
const move = (degrees: number) => { rack.position.set(0.6, 0.7, 0.3); rack.rotation.y = THREE.MathUtils.degToRad(degrees); part.position.set(0.8, 0.2, -0.3); };
const worldMount = (degrees: number) => { move(degrees); return mount.clone().add(part.position).applyAxisAngle(new THREE.Vector3(0, 1, 0), rack.rotation.y).add(rack.position); };
export const demo = pointView('lightWorld', { label: 'rack turn', min: -150, max: 150, step: 5, value: 50 },
  mount, (degrees) => { move(degrees); return lightWorld(part, mount.clone()); }, worldMount,
  (scene, degrees) => { if (!rack.parent) scene.add(rack); move(degrees); });
