import type { Answer } from '@harness/drill';
import { NoColorSpace, SRGBColorSpace, Texture } from 'three';

export interface Maps { albedo: Texture; normal: Texture; roughness: Texture }

export function setTextureSpaces(albedo: Texture, normal: Texture, roughness: Texture): Answer<Maps> {
  albedo.colorSpace = SRGBColorSpace;
  normal.colorSpace = NoColorSpace;
  roughness.colorSpace = NoColorSpace;
  return { albedo, normal, roughness };
}
