import type { Answer } from '@harness/drill';
import { Vector2 } from 'three';

export function frameUv(uv: Vector2, frame: number, columns: number, rows: number): Answer<Vector2> {
  const total = columns * rows;
  const index = ((Math.floor(frame) % total) + total) % total;
  const column = index % columns;
  const row = Math.floor(index / columns);
  return new Vector2((column + uv.x) / columns, (row + uv.y) / rows);
}
