// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function prepareStudio(renderer: {setPixelRatio:(dpr:number)=>void;sortObjects:boolean;shadowMap:{enabled:boolean}}, overlay: THREE.Object3D, light: THREE.Light, part: THREE.Object3D, floor: THREE.Object3D, dpr: number): number {
  renderer.setPixelRatio(Math.min(dpr,2)); renderer.shadowMap.enabled=true; return overlay.renderOrder;
}
