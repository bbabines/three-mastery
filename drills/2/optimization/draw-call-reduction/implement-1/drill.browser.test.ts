import { answered } from '@harness/check';
import * as THREE from 'three';
import { expect, it } from 'vitest';
import { instanceHardware } from './drill';

it('submits repeated geometry in fewer actual WebGL draws', () => {
  const renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setSize(16, 16);
  const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  const material = new THREE.MeshBasicMaterial();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 10);
  camera.position.z = 3;
  const positions = [-0.6, 0, 0.6];
  const separate = new THREE.Scene();
  for (const x of positions) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = x;
    separate.add(mesh);
  }
  renderer.render(separate, camera);
  const separateCalls = renderer.info.render.calls;
  const instanced = new THREE.Scene();
  instanced.add(answered(instanceHardware(geometry, material, positions.map((x) => new THREE.Matrix4().makeTranslation(x, 0, 0)))));
  renderer.render(instanced, camera);
  expect(renderer.info.render.calls).toBeLessThan(separateCalls);
  expect(renderer.info.render.calls).toBe(1);
  geometry.dispose();
  material.dispose();
  renderer.dispose();
});
