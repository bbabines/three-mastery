import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { pointAhead, hotspotPoint } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const sphere = new THREE.Sphere(new THREE.Vector3(0, 1, 0), 0.7); const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.7), new THREE.MeshStandardMaterial({ color: COLORS.blue })); mesh.position.copy(sphere.center); scene.add(mesh); const ray = new THREE.Ray(new THREE.Vector3(-2, 1, 0), new THREE.Vector3(1, 0, 0));
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const ahead = attempt('pointAhead', () => pointAhead(ray, 3)); const hit = attempt('hotspotPoint', () => hotspotPoint(ray, sphere));
    readout.textContent = [ahead.ok ? `ray point x: ${ahead.value.x.toFixed(2)}` : ahead.note, hit.ok ? `sphere hit x: ${hit.value.x.toFixed(2)}` : hit.note].join('\n');
  });
};
