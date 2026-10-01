import type { Answer } from '@harness/drill';
import { mx_worley_noise_float_2d, oneMinus, smoothstep } from 'three/tsl';
import type { Node } from 'three/webgpu';

export function cellMask(uv: Node<'vec2'>, cells: Node<'float'>, edge: Node<'float'>): Answer<Node<'float'>> {
  const distance = mx_worley_noise_float_2d(uv.mul(cells));
  return oneMinus(smoothstep(edge.sub(0.05), edge.add(0.05), distance));
}
