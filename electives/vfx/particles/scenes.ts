import { overlay, slider } from '@harness/lesson';
import type { TslSceneSetup } from '@harness/tsl';
import * as THREE from 'three/webgpu';

export const preview: TslSceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(0, 1.8, 4); controls.target.set(0, 1.2, 0);
  const geometry = new THREE.SphereGeometry(0.045, 8, 8);
  const material = new THREE.MeshBasicNodeMaterial({ color: 0xffb561 });
  const motes: { mesh: THREE.Mesh; age: number; speed: number }[] = [];
  let rate = 8, carry = 0, spawned = 0;
  const readout = overlay(container, 'readout');
  slider(container, 'particles / second', { min: 1, max: 20, step: 1, value: rate }, (value) => (rate = value));
  onFrame((delta) => {
    const dt = Math.min(delta, 0.1);
    const total = carry + rate * dt;
    const count = Math.floor(total);
    carry = total - count;
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(Math.sin(spawned * 2.4) * 0.3, 0.2, Math.cos(spawned * 1.7) * 0.12);
      const speed = 0.7 + (spawned % 4) * 0.12;
      motes.push({ mesh, age: 0, speed }); scene.add(mesh); spawned++;
    }
    for (let i = motes.length - 1; i >= 0; i--) {
      const mote = motes[i]; mote.age += dt;
      mote.mesh.position.y += mote.speed * dt;
      mote.mesh.scale.setScalar(Math.max(0.05, 1 - mote.age / 1.6));
      if (mote.age >= 1.6) { scene.remove(mote.mesh); motes.splice(i, 1); }
    }
    readout.textContent = `${rate} per second · ${motes.length} alive · fractional carry ${carry.toFixed(2)}`;
  });
};
