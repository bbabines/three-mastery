// Reference repair for drills/3/queries/bvh/break-fix-1.
import * as THREE from 'three';

export function candidateLeaves(ray: THREE.Ray, root: THREE.Object3D): THREE.Object3D[] {
  const leaves:THREE.Object3D[]=[]; const visit=(o:THREE.Object3D)=>{const box=o.userData.box as THREE.Box3; if(!ray.intersectsBox(box))return; if(o.children.length===0)leaves.push(o); else o.children.forEach(visit);}; visit(root); return leaves;
}
