import { Material, MeshNormalMaterial, MeshStandardMaterial } from 'three';
export function inspectionMaterial(mode: 'normals' | 'finish'): Material {
 if (mode === 'normals') return new MeshNormalMaterial();
 return new MeshStandardMaterial({color:'#b5824c',roughness:.4});
}
