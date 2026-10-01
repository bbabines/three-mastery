import { overlay, slider } from '@harness/lesson';
import type { TslSceneSetup } from '@harness/tsl';
import * as THREE from 'three/webgpu';

export const preview: TslSceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(0, 1.6, 4.5); controls.target.set(0, 1.3, 0);
  const particle = new THREE.Mesh(new THREE.SphereGeometry(0.12), new THREE.MeshBasicNodeMaterial({ color: 0x38bdf8 }));
  scene.add(particle);
  let position = new THREE.Vector3(-1.2, 2.3, 0), velocity = new THREE.Vector3(1.4, 0.6, 0), drag = 0.5;
  const acceleration = new THREE.Vector3(0, -1.8, 0);
  const readout = overlay(container, 'readout');
  slider(container, 'drag', { min: 0, max: 2, step: 0.1, value: drag }, (value) => (drag = value));
  onFrame((delta) => {
    const dt = Math.min(delta, 0.05);
    velocity.addScaledVector(acceleration, dt).multiplyScalar(Math.exp(-drag * dt));
    position.addScaledVector(velocity, dt); // use the new velocity
    if (position.y < 0.15 || position.x > 1.5) { position = new THREE.Vector3(-1.2, 2.3, 0); velocity = new THREE.Vector3(1.4, 0.6, 0); }
    particle.position.copy(position);
    readout.textContent = `v += a × dt; drag(v); p += new v × dt · y ${position.y.toFixed(2)} · speed ${velocity.length().toFixed(2)}`;
  });
};
