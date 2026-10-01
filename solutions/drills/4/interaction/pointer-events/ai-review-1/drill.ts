import { Vector2 } from 'three';
export function pointerNdc(x: number, y: number, rect: { left: number; top: number; width: number; height: number }, _dpr: number): Vector2 {
  return new Vector2(((x - rect.left) / rect.width) * 2 - 1, -((y - rect.top) / rect.height) * 2 + 1);
}
