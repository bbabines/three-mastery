import { answered } from '@harness/check';
import * as THREE from 'three';
import { expect, it, vi } from 'vitest';
import { injectEmissivePulse } from './drill';
it('renders the patched material with built-in lighting', () => {
 const errors=vi.spyOn(console,'error');
 const renderer=new THREE.WebGLRenderer({antialias:false}); renderer.setSize(16,16);
 const material=answered(injectEmissivePulse(new THREE.MeshStandardMaterial({color:'#305080'}),.25));
 const geometry=new THREE.PlaneGeometry(2,2), scene=new THREE.Scene(); scene.add(new THREE.Mesh(geometry,material));
 scene.add(new THREE.AmbientLight(0xffffff,2));
 const camera=new THREE.PerspectiveCamera(60,1,.1,10); camera.position.z=2;
 const target=new THREE.WebGLRenderTarget(16,16); renderer.setRenderTarget(target); renderer.render(scene,camera);
 const pixel=new Uint8Array(4); renderer.readRenderTargetPixels(target,8,8,1,1,pixel);
 expect(pixel[0]+pixel[1]+pixel[2]).toBeGreaterThan(0);
 expect(errors.mock.calls.flat().join(' ')).not.toMatch(/THREE.WebGLProgram: Shader Error|VALIDATE_STATUS false/);
 errors.mockRestore(); target.dispose(); material.dispose(); geometry.dispose(); renderer.dispose();
});
