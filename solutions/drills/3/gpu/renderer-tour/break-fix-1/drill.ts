// Reference repair for drills/3/gpu/renderer-tour/break-fix-1.
import * as THREE from 'three';

export function prepareStudio(renderer: {setPixelRatio:(dpr:number)=>void;sortObjects:boolean;shadowMap:{enabled:boolean}}, overlay: THREE.Object3D, light: THREE.Light, part: THREE.Object3D, floor: THREE.Object3D, dpr: number): number {
  renderer.setPixelRatio(Math.min(dpr,2)); renderer.sortObjects=true; renderer.shadowMap.enabled=true; light.castShadow=true; part.castShadow=true; floor.receiveShadow=true; overlay.renderOrder=10; return overlay.renderOrder;
}
