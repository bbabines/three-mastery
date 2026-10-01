import * as THREE from 'three';
import { expect } from 'vitest';
import type { prepareStudio } from './drill';

export function checkRendererTour(subject: typeof prepareStudio): void {
  const r={setPixelRatio:(_n:number)=>{},sortObjects:false,shadowMap:{enabled:false}}, overlay=new THREE.Object3D(),light=new THREE.DirectionalLight(),part=new THREE.Mesh(),floor=new THREE.Mesh(); subject(r,overlay,light,part,floor,2); expect(r.shadowMap.enabled).toBe(true); expect(r.sortObjects).toBe(true); expect(light.castShadow).toBe(true); expect(part.castShadow).toBe(true); expect(floor.receiveShadow).toBe(true); expect(overlay.renderOrder).toBe(10);
}
