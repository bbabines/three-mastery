import { expect } from 'vitest';
import { Vector3 } from 'three';

type Slide = (velocity: Vector3, wallNormal: Vector3) => Vector3;

export function checkWallSlide(slide: Slide): void {
  const velocity = new Vector3(3, -1, 4);
  const normal = new Vector3(2, 1, -3);
  const before = velocity.clone();
  const normalBefore = normal.clone();
  expect(slide(velocity, normal).distanceTo(before.clone().projectOnPlane(normal))).toBeLessThan(1e-9);
  expect(velocity.distanceTo(before), 'the caller can reuse its original velocity').toBeLessThan(1e-9);
  expect(normal.distanceTo(normalBefore), 'the caller can reuse its wall normal').toBeLessThan(1e-9);
}
