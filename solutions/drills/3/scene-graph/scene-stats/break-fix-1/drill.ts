// Reference repair for drills/3/scene-graph/scene-stats/break-fix-1.
import * as THREE from 'three';

export function visibleLayerMeshes(root: THREE.Object3D, layer: number): number {
  const mask=new THREE.Layers(); mask.set(layer); let n=0; root.traverseVisible(o=>{if(o instanceof THREE.Mesh && o.layers.test(mask))n++;}); return n;
}
