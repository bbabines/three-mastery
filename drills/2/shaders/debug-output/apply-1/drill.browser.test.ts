import { answered } from '@harness/check';
import * as THREE from 'three';
import { expect, it, vi } from 'vitest';
import { depthDebug } from './drill';
it('draws a greater depth value for a farther surface', () => {
 const errors = vi.spyOn(console, 'error');
 const renderer = new THREE.WebGLRenderer({ antialias: false });
 renderer.setSize(16,16);
 const geometry = new THREE.PlaneGeometry(2,2);
 const material = answered(depthDebug());
 const scene = new THREE.Scene(); const mesh = new THREE.Mesh(geometry,material); scene.add(mesh);
 const camera = new THREE.PerspectiveCamera(60,1,.1,10); camera.position.z = 2;
 const target = new THREE.WebGLRenderTarget(16,16);
 const sample = () => {
  renderer.setRenderTarget(target); renderer.render(scene,camera);
  const pixel = new Uint8Array(4); renderer.readRenderTargetPixels(target,8,8,1,1,pixel);
  expect(pixel[3]).toBe(255); return pixel[0];
 };
 mesh.position.z = 0.5;
 const near = sample();
 mesh.position.z = -0.5;
 const far = sample();
 expect(far).toBeGreaterThan(near);
 expect(errors.mock.calls.flat().join(' ')).not.toMatch(/THREE.WebGLProgram: Shader Error|VALIDATE_STATUS false/);
 errors.mockRestore(); target.dispose(); geometry.dispose(); material.dispose(); renderer.dispose();
});
