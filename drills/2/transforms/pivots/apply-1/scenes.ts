// The orange hinge stays put; the blue door edge should meet the yellow swing spot.
import { ball, COLORS } from '@harness/lesson';
import * as THREE from 'three';
import { pointView } from '../../scene-view';
import { swingDoor } from './drill';

const hinge = new THREE.Vector3(-0.7, 0.8, -0.3);
const edge = new THREE.Vector3(1.1, 0.8, -0.3);
const door = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 0.08), new THREE.MeshStandardMaterial({ color: COLORS.orange, transparent: true, opacity: 0.55 }));
const pin = ball(COLORS.orange);
pin.position.copy(hinge);
export const demo = pointView('swingDoor', { label: 'door turn', min: -150, max: 150, step: 5, value: 60 },
  edge, (degrees) => swingDoor(hinge.clone(), edge.clone(), THREE.MathUtils.degToRad(degrees)),
  (degrees) => edge.clone().sub(hinge).applyAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(degrees)).add(hinge),
  (scene, degrees) => { if (!door.parent) scene.add(door, pin); door.position.copy(hinge).add(new THREE.Vector3(0.9, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(degrees))); door.rotation.y = THREE.MathUtils.degToRad(degrees); });
