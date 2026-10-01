import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { moveInterleaved } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 2, 6); controls.target.set(0, 0.8, 0);
  const data = new THREE.InterleavedBuffer(new Float32Array([
    -1, 0, 0, 0, 0,
    0, 0, 0, 0.5, 0,
    1, 0, 0, 1, 0,
  ]), 5);
  const pos = new THREE.InterleavedBufferAttribute(data, 3, 0);
  const uv = new THREE.InterleavedBufferAttribute(data, 2, 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', pos);
  geometry.setAttribute('uv', uv);
  const wire = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: COLORS.blue, wireframe: true, side: THREE.DoubleSide }));
  wire.frustumCulled = false;
  const goal = ball(COLORS.yellow, 0.6, 0.16);
  goal.position.set(0, 2, 0);
  scene.add(wire, goal);
  const readout = overlay(container, 'readout');
  const result = attempt('moveInterleaved', () => moveInterleaved(pos, 1, new THREE.Vector3(0, 2, 0)));
  readout.textContent = result.ok
    ? `vertex 1 y: ${pos.getY(1).toFixed(1)} (goal: 2.0)\nUV of vertex 0: ${uv.getX(0).toFixed(1)}, ${uv.getY(0).toFixed(1)} (should stay 0.0, 0.0)\nbuffer version: ${data.version} (must advance)`
    : result.note;
};
