// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function captureThumbnail(renderer: {setRenderTarget:(target:THREE.WebGLRenderTarget|null)=>void;render:(scene:THREE.Scene,camera:THREE.Camera)=>void}, scene: THREE.Scene, camera: THREE.Camera, target: THREE.WebGLRenderTarget): void {
  renderer.setRenderTarget(target); renderer.render(scene,camera);
}
