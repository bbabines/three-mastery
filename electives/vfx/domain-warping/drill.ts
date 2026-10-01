import type { Answer } from '@harness/drill';
import type { Node } from 'three/webgpu';

// Offset the UV by two independent smooth-noise fields, then draw a soft circle of radius 0.28
// around its center. amount is the maximum coordinate offset; keep the fade 0.03 wide.
export function warpedCircle(uv: Node<'vec2'>, amount: Node<'float'>): Answer<Node<'float'>> {
  return null;
}
