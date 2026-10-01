import type { Answer } from '@harness/drill';
import { Mesh, MeshStandardMaterial, Texture } from 'three';

export function swapFinish(mesh: Mesh, next: MeshStandardMaterial, ownedMaterials: Set<MeshStandardMaterial>, ownedTextures: Set<Texture>): Answer<boolean> {
  const old = mesh.material;
  if (!(old instanceof MeshStandardMaterial) || old === next) { mesh.material = next; return true; }
  mesh.material = next;
  if (!ownedMaterials.has(old)) return true;
  const slots = ['map', 'alphaMap', 'aoMap', 'bumpMap', 'displacementMap', 'emissiveMap', 'envMap', 'lightMap', 'metalnessMap', 'normalMap', 'roughnessMap'] as const;
  const oldMaps = slots.map((slot) => old[slot]);
  const nextMaps = slots.map((slot) => next[slot]);
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
