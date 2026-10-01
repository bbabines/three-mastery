import { Material, MeshStandardMaterial } from 'three';
export function inspectionMaterial(mode: 'normals' | 'finish'): Material {
 if (mode === 'normals') return new MeshStandardMaterial({color:'#8080ff'});
 return new MeshStandardMaterial({color:'#b5824c',roughness:.4});
}
