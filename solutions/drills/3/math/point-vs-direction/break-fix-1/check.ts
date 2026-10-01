import { expect } from 'vitest';
import { Vector3 } from 'three';

type Finder = (center: Vector3, parts: Vector3[], radius: number) => number;

export function checkNearest(nearestWithin: Finder): void {
  const center = new Vector3(-8, 3, 4);
  const parts = [new Vector3(), center.clone().add(new Vector3(0.3, 0.1, 0)), center.clone().add(new Vector3(0.1, 0, 0))];
  const nearest = parts.map((part, index) => ({ index, distance: part.distanceToSquared(center) }))
    .filter(({ distance }) => distance <= 0.4 ** 2)
    .sort((a, b) => a.distance - b.distance)[0]?.index ?? -1;
  expect(nearestWithin(center, parts, 0.4)).toBe(nearest);
}
