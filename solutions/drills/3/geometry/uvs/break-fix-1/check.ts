import * as THREE from 'three';
import { expect } from 'vitest';
import type { tileFirstFace } from './drill';

export function checkUvs(subject: typeof tileFirstFace): void {
  const geometry = new THREE.PlaneGeometry(2, 2, 2, 2);
  const result = subject(geometry, new THREE.Vector2(-0.5, 1));
  const corners = result.index?.count ?? result.getAttribute('position').count;
  expect(result.groups).toEqual([
    { start: 0, count: 3, materialIndex: 1 },
    { start: 3, count: corners - 3, materialIndex: 0 },
  ]);
}
