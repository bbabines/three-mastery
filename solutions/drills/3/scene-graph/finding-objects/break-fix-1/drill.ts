// Reference repair for drills/3/scene-graph/finding-objects/break-fix-1.
import * as THREE from 'three';

export function findSku(root: THREE.Object3D, sku: string): THREE.Object3D | null {
  let found:THREE.Object3D|null=null; root.traverse(o=>{if(found===null && o.userData.sku===sku)found=o;}); return found;
}
