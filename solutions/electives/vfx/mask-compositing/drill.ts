import type { Answer } from '@harness/drill';
import { length, max, oneMinus, smoothstep, vec2 } from 'three/tsl';
import type { Node } from 'three/webgpu';

export function cutoutMask(uv: Node<'vec2'>, gap: Node<'float'>, softness: Node<'float'>): Answer<Node<'float'>> {
  const p = uv.sub(0.5);
  const outer = length(p).sub(0.32);
  const hole = length(p.sub(vec2(gap, 0))).sub(0.14);
  return oneMinus(smoothstep(0, softness, max(outer, hole.negate())));
}
