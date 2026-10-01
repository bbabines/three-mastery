import { expect } from 'vitest';
import { Vector3 } from 'three';

type Finder = (center: Vector3, parts: Vector3[], radius: number) => number;

export function checkNearest(nearestWithin: Finder): void {
  const center = new Vector3(-8, 3, 4);
  const parts = [new Vector3(), center.clone().add(new Vector3(0.2, 0.1, 0))];
  const nearest = parts.findIndex((part) => part.distanceToSquared(center) <= 0.4 ** 2);
  expect(nearestWithin(center, parts, 0.4)).toBe(nearest);
}
