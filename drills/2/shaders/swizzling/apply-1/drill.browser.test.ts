import { answered } from '@harness/check';
import * as THREE from 'three';
import { expect, it, vi } from 'vitest';
import { zUpToYUp } from './drill';
it('turns a Z-up triangle into a visible Y-up triangle', () => {
 const errors=vi.spyOn(console,'error');
 const renderer=new THREE.WebGLRenderer({antialias:false}); renderer.setSize(16,16);
 renderer.setClearColor(0x000000,0);
 const geometry=new THREE.BufferGeometry();
 geometry.setAttribute('position', new THREE.Float32BufferAttribute([
  -0.3,0,0, 0.3,0,0, 0,0,1,
 ],3));
 const material=answered(zUpToYUp());
 const scene=new THREE.Scene(); scene.add(new THREE.Mesh(geometry,material));
 const camera=new THREE.PerspectiveCamera(60,1,.1,10); camera.position.z=2;
 const target=new THREE.WebGLRenderTarget(16,16); renderer.setRenderTarget(target); renderer.render(scene,camera);
 const upper=new Uint8Array(4), lower=new Uint8Array(4);
 renderer.readRenderTargetPixels(target,8,11,1,1,upper);
 renderer.readRenderTargetPixels(target,8,4,1,1,lower);
 expect(upper[3]).toBe(255);
 expect(lower[3]).toBe(0);
 expect(errors.mock.calls.flat().join(' ')).not.toMatch(/THREE.WebGLProgram: Shader Error|VALIDATE_STATUS false/);
 errors.mockRestore(); target.dispose(); geometry.dispose(); material.dispose(); renderer.dispose();
});
