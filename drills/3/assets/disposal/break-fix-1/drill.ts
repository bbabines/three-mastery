// Product-route cleanup: identify what removal leaves behind.
import { Object3D } from 'three';

export function retireProduct(root: Object3D): void {
  root.removeFromParent();
}
