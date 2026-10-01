import { overlay, slider } from '@harness/lesson';
import type { TslSceneSetup } from '@harness/tsl';
import { softParticleOpacity } from '../shared';
import { length, oneMinus, smoothstep, uniform, uv } from 'three/tsl';
import * as THREE from 'three/webgpu';

export const preview: TslSceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.9, 4); controls.target.set(0, 0.7, 0);
  for (const child of scene.children) if (child instanceof THREE.GridHelper) child.visible = false;
  const floor = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.12, 1), new THREE.MeshStandardNodeMaterial({ color: 0x39434f }));
  floor.position.y = -0.06; scene.add(floor);
  const shape = oneMinus(smoothstep(0.3, 0.5, length(uv().sub(0.5))));
  const distance = uniform(0.55);
  const makePuff = (x: number, soft: boolean) => {
    const material = new THREE.MeshBasicNodeMaterial({ color: 0xaed9ed, transparent: true, depthWrite: false, side: THREE.DoubleSide });
    material.opacityNode = soft ? softParticleOpacity(shape, distance) : shape;
    const puff = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 1.25), material);
    puff.position.set(x, 0.33, 0); scene.add(puff);
  };
  makePuff(-0.9, false); makePuff(0.9, true);
  const readout = overlay(container, 'readout');
  readout.textContent = 'Left: hard intersection with the floor. Right: opacity fades against scene depth.';
  slider(container, 'fade distance', { min: 0.1, max: 1.2, step: 0.05, value: 0.55 }, (value) => (distance.value = value));
};
