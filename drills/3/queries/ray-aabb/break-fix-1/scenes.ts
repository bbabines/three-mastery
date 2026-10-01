import { ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { rotatedBoxHit } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3,3,5); controls.target.set(0,0.5,0);
  const subject = new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color:COLORS.blue}));
  const marker = ball(COLORS.yellow); subject.position.y=0.5; marker.position.x=1.5; marker.position.y=0.5; scene.add(subject,marker);
  const readout=overlay(container,'readout');

  const got=rotatedBoxHit(new THREE.Ray(new THREE.Vector3(3,0,5),new THREE.Vector3(0,0,-1)),new THREE.Box3(new THREE.Vector3(-1,-1,-1),new THREE.Vector3(1,1,1)),new THREE.Matrix4().makeTranslation(3,0,0));
  readout.textContent=`your hit: ${got?.toArray().map(n=>n.toFixed(1)).join(', ') ?? 'miss'}\nreference: 3.0, 0.0, 1.0`;
};
