import type { Answer } from '@harness/drill';
import type { Node } from 'three/webgpu';

// Make four soft vertical bands move to the right. Wrap elapsed time before adding it to UV;
// speed is turns per second, so a long-running page must not accumulate a huge phase.
export function flowBands(uv: Node<'vec2'>, time: Node<'float'>, speed: Node<'float'>): Answer<Node<'float'>> {
  return null;
}
