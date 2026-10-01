// Reference repair for drills/3/gpu/render-targets/break-fix-1.
import * as THREE from 'three';

export function captureThumbnail(renderer: {setRenderTarget:(target:THREE.WebGLRenderTarget|null)=>void;render:(scene:THREE.Scene,camera:THREE.Camera)=>void}, scene: THREE.Scene, camera: THREE.Camera, target: THREE.WebGLRenderTarget): void {
  renderer.setRenderTarget(target); try { renderer.render(scene,camera); } finally { renderer.setRenderTarget(null); }
}
