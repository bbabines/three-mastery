import { answered } from '@harness/check';
import * as THREE from 'three';
import { expect, it, vi } from 'vitest';
import { softRing } from './drill';
it('draws a bright ring with dark pixels inside and outside', () => {
 const errors = vi.spyOn(console, 'error');
 const renderer = new THREE.WebGLRenderer({ antialias: false });
 renderer.setSize(64,64);
 const geometry = new THREE.PlaneGeometry(2,2);
 const material = answered(softRing(.3,.03));
 const scene = new THREE.Scene(); scene.add(new THREE.Mesh(geometry,material));
 const camera = new THREE.PerspectiveCamera(60,1,.1,10); camera.position.z = 2;
 const target = new THREE.WebGLRenderTarget(64,64);
 renderer.setRenderTarget(target); renderer.render(scene,camera);
 const redAt = (x: number) => {
  const pixel = new Uint8Array(4);
  renderer.readRenderTargetPixels(target,x,32,1,1,pixel);
  expect(pixel[3]).toBe(255);
  return pixel[0];
 };
 expect(redAt(32)).toBeLessThan(20);
 expect(redAt(48)).toBeGreaterThan(150);
 expect(redAt(57)).toBeLessThan(20);
 expect(errors.mock.calls.flat().join(' ')).not.toMatch(/THREE.WebGLProgram: Shader Error|VALIDATE_STATUS false/);
 errors.mockRestore(); target.dispose(); geometry.dispose(); material.dispose(); renderer.dispose();
});
