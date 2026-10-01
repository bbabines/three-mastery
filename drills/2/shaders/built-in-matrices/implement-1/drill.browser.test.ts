import { answered } from '@harness/check';
import * as THREE from 'three';
import { expect, it, vi } from 'vitest';
import { viewRim } from './drill';
it('brightens the rim as the surface turns from the camera', () => {
 const errors = vi.spyOn(console, 'error');
 const renderer = new THREE.WebGLRenderer({ antialias: false });
 renderer.setSize(16,16);
 const geometry = new THREE.PlaneGeometry(2,2);
 const material = answered(viewRim());
 const scene = new THREE.Scene(); const mesh = new THREE.Mesh(geometry,material); scene.add(mesh);
 const camera = new THREE.PerspectiveCamera(60,1,.1,10); camera.position.z = 2;
 const target = new THREE.WebGLRenderTarget(16,16);
 const sample = () => {
  renderer.setRenderTarget(target); renderer.render(scene,camera);
  const pixel = new Uint8Array(4); renderer.readRenderTargetPixels(target,8,8,1,1,pixel);
  expect(pixel[3]).toBe(255); return pixel[0];
 };
 const front = sample();
 mesh.rotation.y = 0.8;
 const turned = sample();
 expect(turned).toBeGreaterThan(front + 40);
 expect(errors.mock.calls.flat().join(' ')).not.toMatch(/THREE.WebGLProgram: Shader Error|VALIDATE_STATUS false/);
 errors.mockRestore(); target.dispose(); geometry.dispose(); material.dispose(); renderer.dispose();
});
