import type { Answer } from '@harness/drill';
import { LinearMipmapLinearFilter, MeshStandardMaterial, NoColorSpace, Texture } from 'three';
export function packedTiledSurface(material: MeshStandardMaterial, orm: Texture, maxAnisotropy: number): Answer<MeshStandardMaterial> {
 orm.colorSpace = NoColorSpace;
 orm.generateMipmaps = true;
 orm.minFilter = LinearMipmapLinearFilter;
 orm.anisotropy = Math.max(1, maxAnisotropy);
 material.roughnessMap = orm;
 material.metalnessMap = orm;
 return material;
}
