import type { Answer } from '@harness/drill';
import type { Node } from 'three/webgpu';

// Cut a smaller circle out of a larger one. gap moves the hole right from the center; softness
// is the width of the mask's fade outside the resulting edge.
export function cutoutMask(uv: Node<'vec2'>, gap: Node<'float'>, softness: Node<'float'>): Answer<Node<'float'>> {
  return null;
}
