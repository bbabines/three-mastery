// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function prepareGlass(material: THREE.MeshBasicMaterial, opacity: number): THREE.MeshBasicMaterial {
  material.transparent=true; material.opacity=opacity; return material;
}
