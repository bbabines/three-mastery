import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { prepareStudio } from './drill';

describe('gpu.renderer-tour', () => {
  it('enables shadows and draws the label above depth-tested parts', () => {
    let ratio=0; const fake={setPixelRatio:(n:number)=>{ratio=n;},sortObjects:false,shadowMap:{enabled:false}}, overlay=new THREE.Mesh(),light=new THREE.DirectionalLight(),part=new THREE.Mesh(),floor=new THREE.Mesh(); expect(prepareStudio(fake,overlay,light,part,floor,3)).toBe(10); expect(ratio).toBe(2); expect(fake.sortObjects).toBe(true); expect(light.castShadow&&part.castShadow&&floor.receiveShadow).toBe(true); expect((overlay.material as THREE.Material).depthTest).toBe(false);
    prepareStudio(fake,overlay,light,part,floor,1.5); expect(ratio).toBe(1.5);
  });
});
