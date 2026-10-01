import type { Answer } from '@harness/drill';
import { MeshStandardMaterial, Texture } from 'three';
export function localChromeReflection(material: MeshStandardMaterial, reflection: Texture, intensity: number): Answer<MeshStandardMaterial> {
  material.envMap = reflection;
  material.envMapIntensity = intensity;
  material.metalness = 1;
  material.roughness = .08;
  return material;
}
