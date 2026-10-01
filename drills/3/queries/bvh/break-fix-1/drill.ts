// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function candidateLeaves(ray: THREE.Ray, root: THREE.Object3D): THREE.Object3D[] {
  const leaves:THREE.Object3D[]=[]; root.traverse(o=>{if(o.children.length===0)leaves.push(o);}); return leaves;
}
