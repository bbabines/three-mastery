import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { enabledPhysicalFeatures, precompileScene } from './drill';

describe('enabledPhysicalFeatures', () => {
it('counts enabled features, not the material class name', () => {
    const material=new THREE.MeshPhysicalMaterial(); expectNumber(enabledPhysicalFeatures(material),0);
    material.clearcoat=1; material.transmission=0.6; expectNumber(enabledPhysicalFeatures(material),2); material.dispose();
  });
});

describe('precompileScene', () => {
it('returns the renderer pre-compile Promise for this scene', async () => {
    const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(); let calls=0; const pending=Promise.resolve(scene as THREE.Object3D);
    const renderer={compileAsync:(s:THREE.Object3D,c:THREE.Camera)=>{expect(s).toBe(scene);expect(c).toBe(camera);calls++;return pending;}} as Pick<THREE.WebGLRenderer,'compileAsync'>;
    expect(answered(precompileScene(renderer,scene,camera))).toBe(pending); await pending; expect(calls).toBe(1);
  });
});
