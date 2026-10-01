import type { Answer } from '@harness/drill';
import { Vector2 } from 'three';

// Give the local UV inside one cell of a bottom-left-origin atlas. Wrap integer frame indexes
// into the atlas. Do not change the input UV.
export function frameUv(uv: Vector2, frame: number, columns: number, rows: number): Answer<Vector2> {
  return null;
}
