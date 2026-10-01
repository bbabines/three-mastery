import { answered } from '@harness/check';
import * as THREE from 'three';
import { expect, it, vi } from 'vitest';
import { uvDebug } from './drill';
it('draws changing red and green UV bands', () => {
 const errors = vi.spyOn(console, 'error');
 const renderer = new THREE.WebGLRenderer({ antialias: false });
 renderer.setSize(16,16);
 const geometry = new THREE.PlaneGeometry(2,2);
 const material = answered(uvDebug());
 const scene = new THREE.Scene(); scene.add(new THREE.Mesh(geometry,material));
 const camera = new THREE.PerspectiveCamera(60,1,.1,10); camera.position.z = 2;
 const target = new THREE.WebGLRenderTarget(16,16);
 renderer.setRenderTarget(target); renderer.render(scene,camera);
 const at = (x: number, y: number) => {
  const pixel = new Uint8Array(4); renderer.readRenderTargetPixels(target,x,y,1,1,pixel);
  expect(pixel[3]).toBe(255); return pixel;
 };
 expect(Math.abs(at(4,8)[0]-at(6,8)[0])).toBeGreaterThan(30);
 expect(Math.abs(at(8,4)[1]-at(8,6)[1])).toBeGreaterThan(30);
 expect(at(8,8)[2]).toBeLessThan(10);
 expect(errors.mock.calls.flat().join(' ')).not.toMatch(/THREE.WebGLProgram: Shader Error|VALIDATE_STATUS false/);
 errors.mockRestore(); target.dispose(); geometry.dispose(); material.dispose(); renderer.dispose();
});
