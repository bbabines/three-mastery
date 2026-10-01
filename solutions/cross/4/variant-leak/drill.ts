import type { Answer } from '@harness/drill';
import { Mesh, MeshStandardMaterial, Texture } from 'three';

export function swapFinish(mesh: Mesh, next: MeshStandardMaterial, ownedMaterials: Set<MeshStandardMaterial>, ownedTextures: Set<Texture>): Answer<boolean> {
  const old = mesh.material;
  if (!(old instanceof MeshStandardMaterial) || old === next) { mesh.material = next; return true; }
  mesh.material = next;
  if (!ownedMaterials.has(old)) return true;
  const oldMaps = [old.map,old.normalMap,old.roughnessMap,old.metalnessMap];
  const nextMaps = [next.map,next.normalMap,next.roughnessMap,next.metalnessMap];
  for (const texture of oldMaps) {
    if (texture && ownedTextures.has(texture) && !nextMaps.includes(texture)) {
      texture.dispose();
      ownedTextures.delete(texture);
    }
  }
  old.dispose();
  ownedMaterials.delete(old);
  return true;
}
