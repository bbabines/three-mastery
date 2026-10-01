import type { Answer } from '@harness/drill';
import { length, mx_noise_float, oneMinus, smoothstep, vec2 } from 'three/tsl';
import type { Node } from 'three/webgpu';

export function warpedCircle(uv: Node<'vec2'>, amount: Node<'float'>): Answer<Node<'float'>> {
  const p = uv.sub(0.5);
  const n = vec2(mx_noise_float(uv.mul(4)), mx_noise_float(uv.mul(4).add(vec2(17, 31))));
  const distance = length(p.add(n.mul(amount))).sub(0.28);
  return oneMinus(smoothstep(0, 0.03, distance));
}
