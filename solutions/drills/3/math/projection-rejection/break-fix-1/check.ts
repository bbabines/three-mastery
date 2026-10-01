import { expect } from 'vitest';
import { Vector3 } from 'three';
import type { WallMotion } from './drill';

type Bounce = (incoming: Vector3, normal: Vector3) => WallMotion;

export function checkWall(slideAndBounce: Bounce): void {
  const incoming = new Vector3(1, 0.3, -0.2);
  const normal = new Vector3(1, 0.5, 1).multiplyScalar(3);
  const { slide, bounce } = slideAndBounce(incoming, normal);
  expect(slide.dot(normal)).toBeCloseTo(0);
  expect(bounce.length()).toBeCloseTo(incoming.length());
  expect(bounce.dot(normal.clone().normalize())).toBeCloseTo(-incoming.dot(normal.clone().normalize()));
}
