import type { Answer } from '@harness/drill';
import { EquirectangularReflectionMapping, MeshStandardMaterial, Scene, Texture } from 'three';

export function prepareChrome(scene: Scene, material: MeshStandardMaterial, preferred: Texture, fallback: Texture, preferredSupported: boolean): Answer<'preferred' | 'fallback'> {
  const chosen = preferredSupported ? preferred : fallback;
  chosen.mapping = EquirectangularReflectionMapping;
  scene.environment = chosen;
  material.metalness = 1;
  material.needsUpdate = true;
  return preferredSupported ? 'preferred' : 'fallback';
}
