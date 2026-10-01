import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { prepareStudio } from './drill';

describe('gpu.renderer-tour', () => {
  it('repairs the reported symptom for a general case', () => {
    let ratio=0; const fake={setPixelRatio:(n:number)=>{ratio=n;},sortObjects:false,shadowMap:{enabled:false}}, overlay=new THREE.Object3D(),light=new THREE.DirectionalLight(),part=new THREE.Mesh(),floor=new THREE.Mesh(); expect(prepareStudio(fake,overlay,light,part,floor,3)).toBe(10); expect(ratio).toBe(2); expect(fake.sortObjects).toBe(true); expect(light.castShadow&&part.castShadow&&floor.receiveShadow).toBe(true);
  });
});
