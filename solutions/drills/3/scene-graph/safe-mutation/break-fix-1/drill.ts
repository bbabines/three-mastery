// Reference repair for drills/3/scene-graph/safe-mutation/break-fix-1.
import * as THREE from 'three';

export function clearMarked(root: THREE.Object3D): number {
  const marked:THREE.Object3D[]=[];
  root.traverse(o=>{if(o.userData.highlightHelper)marked.push(o);});
  marked.forEach(o=>{
    const target=o.userData.target as THREE.Mesh;
    target.material=target.userData.originalMaterial as THREE.Material;
    o.removeFromParent();
  });
  return marked.length;
}
