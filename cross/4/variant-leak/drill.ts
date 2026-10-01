import type { Answer } from '@harness/drill';
import { Mesh, MeshStandardMaterial, Texture } from 'three';

export function swapFinish(mesh: Mesh, next: MeshStandardMaterial, ownedMaterials: Set<MeshStandardMaterial>, ownedTextures: Set<Texture>): Answer<boolean> {
  return null;
}
