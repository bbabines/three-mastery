import { Object3D, Raycaster } from 'three';
export function hitsNow(raycaster: Raycaster, object: Object3D): boolean {
  return raycaster.intersectObject(object, true).length > 0;
}
