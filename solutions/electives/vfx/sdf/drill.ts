// Reference for the signed distance fields exercise. The page draws this next to Brad's version.
import type { Answer } from '@harness/drill';
import { abs, length, oneMinus, smoothstep } from 'three/tsl';
import type { Node } from 'three/webgpu';

export function softRing(uv: Node<'vec2'>, radius: Node<'float'>, width: Node<'float'>): Answer<Node<'float'>> {
  const d = length(uv.sub(0.5)).sub(radius); // signed distance to the circle: negative inside
  return oneMinus(smoothstep(0, width, abs(d))); // 1 on the circle, 0 from `width` away on either side
}
