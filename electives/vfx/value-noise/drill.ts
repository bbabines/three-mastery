import type { Answer } from '@harness/drill';
import type { Node } from 'three/webgpu';

// Turn deterministic smooth noise into a cloud mask. scale controls feature size; cutoff is the
// level at which the cloud becomes visible. Keep the transition 0.16 wide.
export function cloudMask(uv: Node<'vec2'>, scale: Node<'float'>, cutoff: Node<'float'>): Answer<Node<'float'>> {
  return null;
}
