import type { Answer } from '@harness/drill';
import type { Node } from 'three/webgpu';

// Sum three smooth-noise octaves at scales 1, 2, and 4, with weights 1, 0.5, and 0.25. Normalize
// by their total weight, map to 0–1, then make a mask with a 0.16-wide transition at cutoff.
export function layeredMask(uv: Node<'vec2'>, scale: Node<'float'>, cutoff: Node<'float'>): Answer<Node<'float'>> {
  return null;
}
