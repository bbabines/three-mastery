import * as THREE from 'three';
import { expect } from 'vitest';
import type { prepareStudio } from './drill';

export function checkRendererTour(subject: typeof prepareStudio): void {
  let ratio=0; const r={setPixelRatio:(n:number)=>{ratio=n;},sortObjects:false,shadowMap:{enabled:false}}, overlay=new THREE.Mesh(),light=new THREE.DirectionalLight(),part=new THREE.Mesh(),floor=new THREE.Mesh(); subject(r,overlay,light,part,floor,1.5); expect(r.shadowMap.enabled).toBe(true); expect(r.sortObjects).toBe(true); expect(light.castShadow).toBe(true); expect(part.castShadow).toBe(true); expect(floor.receiveShadow).toBe(true); expect(overlay.renderOrder).toBe(10); expect((overlay.material as THREE.Material).depthTest).toBe(false); expect(ratio).toBe(1.5);
}
