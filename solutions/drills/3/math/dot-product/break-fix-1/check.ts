import { expect } from 'vitest';
import { Vector3 } from 'three';

type Scanner = (facing: Vector3, toward: Vector3, halfAngle: number) => boolean;

export function checkScanner(canSee: Scanner): void {
  const facing = new Vector3(0, 0, 5);
  const outside = new Vector3(3, 1, 1);
  expect(canSee(facing, outside, Math.PI / 4)).toBe(facing.angleTo(outside) <= Math.PI / 4);
}
