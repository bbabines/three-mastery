import { answered } from '@harness/check';
import * as THREE from 'three';
import { expect, it, vi } from 'vitest';
import { pulseUv } from './drill';
it('passes UV coordinates and time through both shader stages', () => {
 const errors = vi.spyOn(console, 'error');
 const renderer = new THREE.WebGLRenderer({ antialias: false });
 renderer.setSize(16,16);
 const geometry = new THREE.PlaneGeometry(2,2);
 const material = answered(pulseUv(1.25));
 const scene = new THREE.Scene(); scene.add(new THREE.Mesh(geometry,material));
 const camera = new THREE.PerspectiveCamera(60,1,.1,10); camera.position.z = 2;
 const target = new THREE.WebGLRenderTarget(16,16);
 renderer.setRenderTarget(target); renderer.render(scene,camera);
 const sample = (x: number, y: number) => {
  const pixel = new Uint8Array(4); renderer.readRenderTargetPixels(target,x,y,1,1,pixel);
  expect(pixel[3]).toBe(255); return pixel;
 };
 expect(sample(12,8)[0]).toBeGreaterThan(sample(4,8)[0] + 40);
 expect(sample(8,12)[1]).toBeGreaterThan(sample(8,4)[1] + 40);
 expect(errors.mock.calls.flat().join(' ')).not.toMatch(/THREE.WebGLProgram: Shader Error|VALIDATE_STATUS false/);
 errors.mockRestore(); target.dispose(); geometry.dispose(); material.dispose(); renderer.dispose();
});
