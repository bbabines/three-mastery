import type { Answer } from '@harness/drill';
import type { Node } from 'three/webgpu';

// Show regions close to a feature point. cells scales the UV; edge is the distance where the
// region fades out over a 0.10-wide band.
export function cellMask(uv: Node<'vec2'>, cells: Node<'float'>, edge: Node<'float'>): Answer<Node<'float'>> {
  return null;
}
