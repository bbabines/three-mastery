import type { Answer } from '@harness/drill';
import { Texture } from 'three';

export interface Maps { albedo: Texture; normal: Texture; roughness: Texture }

// Return the same textures, with the color map in sRGB and data maps unconverted.
export function setTextureSpaces(albedo: Texture, normal: Texture, roughness: Texture): Answer<Maps> {
  return null;
}
