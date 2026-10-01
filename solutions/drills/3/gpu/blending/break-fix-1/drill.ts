// Reference repair for drills/3/gpu/blending/break-fix-1.
import * as THREE from 'three';

export function prepareGlass(material: THREE.MeshBasicMaterial, opacity: number): THREE.MeshBasicMaterial {
  material.transparent=true; material.opacity=opacity; material.depthTest=true; material.depthWrite=false; return material;
}
