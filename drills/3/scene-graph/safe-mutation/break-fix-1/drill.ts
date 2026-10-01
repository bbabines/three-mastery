// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function clearMarked(root: THREE.Object3D): number {
  let count=0;
  for(let i=0;i<root.children.length;i++){
    const o=root.children[i];
    if(o.userData.highlightHelper){
      const target=o.userData.target as THREE.Mesh;
      target.material=target.userData.originalMaterial as THREE.Material;
      o.removeFromParent(); count++;
    }
  }
  return count;
}
