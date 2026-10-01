// Memory: budget several textures. Write the functions, save, and run: npm run drill -- drills/2/assets/memory-math/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// Total decoded RGBA8 bytes with mipmaps.
export function textureSetBytes(textures: { width: number; height: number }[]): Answer<number> {
  let total = 0;
  for (const texture of textures) { let w = texture.width, h = texture.height; while (true) { total += w * h * 4; if (w === 1 && h === 1) break; w = Math.max(1, Math.floor(w / 2)); h = Math.max(1, Math.floor(h / 2)); } }
  return total;
}
