// Reference repair for drills/3/scene-graph/clone-semantics/break-fix-1.
import * as THREE from 'three';

export function variant(source: THREE.Mesh): THREE.Mesh {
  const copy=source.clone(); copy.material=(source.material as THREE.Material).clone(); return copy;
}
