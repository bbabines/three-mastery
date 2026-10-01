import { answered } from '@harness/check';
import * as THREE from 'three';
import { expect, it, vi } from 'vitest';
import { barycentricWire } from './drill';
it('draws triangle edges from barycentric vertex values', () => {
 const errors = vi.spyOn(console, 'error');
 const renderer = new THREE.WebGLRenderer({ antialias: false });
 renderer.setSize(64,64);
 const geometry = new THREE.PlaneGeometry(2,2).toNonIndexed();
 geometry.setAttribute('barycentric', new THREE.Float32BufferAttribute([
  1,0,0, 0,1,0, 0,0,1,
  1,0,0, 0,1,0, 0,0,1,
 ], 3));
 const material = answered(barycentricWire());
 const scene = new THREE.Scene(); scene.add(new THREE.Mesh(geometry,material));
 const camera = new THREE.PerspectiveCamera(60,1,.1,10); camera.position.z = 2;
 const target = new THREE.WebGLRenderTarget(64,64);
 renderer.setRenderTarget(target); renderer.render(scene,camera);
 const edge = new Uint8Array(4), face = new Uint8Array(4);
 renderer.readRenderTargetPixels(target,32,32,1,1,edge);
 renderer.readRenderTargetPixels(target,20,32,1,1,face);
 expect(edge[3]).toBe(255);
 expect(face[3]).toBe(255);
 expect(edge[0]).toBeGreaterThan(face[0] + 100);
 expect(errors.mock.calls.flat().join(' ')).not.toMatch(/THREE.WebGLProgram: Shader Error|VALIDATE_STATUS false/);
 errors.mockRestore(); target.dispose(); geometry.dispose(); material.dispose(); renderer.dispose();
});
