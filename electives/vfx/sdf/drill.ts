// Exercise for the signed distance fields page. Write softRing, then save: the page reloads, draws
// your mask next to the reference, and measures how closely they match.
//
// TSL functions come from 'three/tsl'. The three.js docs and source are fine to use; AI tools and
// /solutions are not.
import type { Answer } from '@harness/drill';
import type { Node } from 'three/webgpu';

// A soft ring: 1 on the circle of `radius` around the middle of the square, fading smoothly to 0 at
// `width` away from the circle, inside and outside, and 0 everywhere farther away.
//
//   uv      the square's UV: 0 to 1 across each side, so (0.5, 0.5) is the middle
//   radius  the circle's radius, in the same units (the square is 1 across)
//   width   how far the ring fades out on each side of the circle, in the same units
export function softRing(uv: Node<'vec2'>, radius: Node<'float'>, width: Node<'float'>): Answer<Node<'float'>> {
  return null;
}
