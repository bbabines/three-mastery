import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { labelPosition } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3.5, 3, 5);
  controls.target.set(0, 0.5, 0);
  const subject = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  const marker = ball(COLORS.yellow);
  subject.position.y = 0.5;
  marker.position.set(1.5, 0.5, 0);
  scene.add(subject, marker);
  const readout = overlay(container, 'readout');
  const viewCamera=new THREE.PerspectiveCamera(60,1,0.1,100); viewCamera.position.z=4; scene.add(viewCamera);
  const result = attempt('labelPosition', () => labelPosition(viewCamera, new THREE.Vector3(0,0,0), 800, 600));
  readout.textContent = result.ok ? `labelPosition: ${JSON.stringify(result.value)?.slice(0, 160)}` : result.note;
};
