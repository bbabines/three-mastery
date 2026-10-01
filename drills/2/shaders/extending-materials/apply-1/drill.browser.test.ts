import { answered } from '@harness/check';
import * as THREE from 'three';
import { expect, it, vi } from 'vitest';
import { injectEmissivePulse } from './drill';
it('adds visible emissive light while retaining built-in lighting', () => {
 const errors=vi.spyOn(console,'error');
 const renderer=new THREE.WebGLRenderer({antialias:false}); renderer.setSize(16,16);
 const base = new THREE.MeshStandardMaterial({color:'#305080'});
 const material=answered(injectEmissivePulse(new THREE.MeshStandardMaterial({color:'#305080'}),.25));
 const geometry=new THREE.PlaneGeometry(2,2), scene=new THREE.Scene();
 const mesh = new THREE.Mesh(geometry,base); scene.add(mesh);
 scene.add(new THREE.AmbientLight(0xffffff,2));
 const camera=new THREE.PerspectiveCamera(60,1,.1,10); camera.position.z=2;
 const target=new THREE.WebGLRenderTarget(16,16);
 const sample = () => {
  renderer.setRenderTarget(target); renderer.render(scene,camera);
  const pixel=new Uint8Array(4); renderer.readRenderTargetPixels(target,8,8,1,1,pixel);
  expect(pixel[3]).toBe(255); return pixel[0]+pixel[1]+pixel[2];
 };
 const unpatched = sample();
 mesh.material = material;
 const patched = sample();
 expect(patched).toBeGreaterThan(unpatched + 20);
 expect(errors.mock.calls.flat().join(' ')).not.toMatch(/THREE.WebGLProgram: Shader Error|VALIDATE_STATUS false/);
 errors.mockRestore(); target.dispose(); base.dispose(); material.dispose(); geometry.dispose(); renderer.dispose();
});
