// The blue local vertex should land on the yellow world point after scale, turn, shift.
import { COLORS } from '@harness/lesson';
import * as THREE from 'three';
import { pointView } from '../../scene-view';
import { placeVertex } from './drill';

const vertex = new THREE.Vector3(0.4, 0.3, 0.25);
const position = new THREE.Vector3(0.9, 0.8, -0.3);
const scale = new THREE.Vector3(1.7, 0.6, 1.2);
const turn = (degrees: number) => new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(degrees));
const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.5), new THREE.MeshStandardMaterial({ color: COLORS.orange, wireframe: true }));
export const demo = pointView('placeVertex', { label: 'model turn', min: -150, max: 150, step: 5, value: 50 },
  vertex, (degrees) => placeVertex(vertex.clone(), position.clone(), turn(degrees), scale.clone()),
  (degrees) => vertex.clone().multiply(scale).applyQuaternion(turn(degrees)).add(position),
  (scene, degrees) => { if (!mesh.parent) scene.add(mesh); mesh.position.copy(position); mesh.quaternion.copy(turn(degrees)); mesh.scale.copy(scale); });
