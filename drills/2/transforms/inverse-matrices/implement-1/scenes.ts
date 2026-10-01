// Gray marks the world hit on the moved child; yellow marks its local ghost spot.
import { COLORS } from '@harness/lesson';
import * as THREE from 'three';
import { pointView } from '../../scene-view';
import { pointInPart } from './drill';

const local = new THREE.Vector3(0.35, 0.2, 0.2);
const parent = new THREE.Group();
const part = new THREE.Mesh(new THREE.BoxGeometry(1, 0.6, 0.6), new THREE.MeshStandardMaterial({ color: COLORS.orange, wireframe: true }));
parent.add(part);
const ghost = new THREE.Mesh(part.geometry, new THREE.MeshStandardMaterial({ color: COLORS.gray, wireframe: true }));
const move = (degrees: number) => { parent.position.set(1.3, 0.8, -0.6); parent.rotation.y = THREE.MathUtils.degToRad(degrees); part.position.set(0.4, 0.2, 0.3); };
const worldHit = (degrees: number) => { move(degrees); return local.clone().applyMatrix4(part.matrix).applyMatrix4(parent.matrix); };
export const demo = pointView('pointInPart', { label: 'rack turn', min: -150, max: 150, step: 5, value: 50 },
  worldHit, (degrees) => { const hit = worldHit(degrees); return pointInPart(part, hit); }, () => local.clone(),
  (scene, degrees) => { if (!parent.parent) scene.add(parent, ghost); move(degrees); parent.updateMatrix(); part.updateMatrix(); });
