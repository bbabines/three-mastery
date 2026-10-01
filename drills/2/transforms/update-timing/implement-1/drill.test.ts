import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { freshWorldPoint } from './drill';

describe('transforms.update-timing', () => {
  it('get a point on a part in world space immediately after an ancestor moves, before another frame renders', () => {
    const outer = new THREE.Group(); const inner = new THREE.Group(); const part = new THREE.Object3D(); outer.add(inner); inner.add(part);
    outer.position.set(1, 0, 2); inner.rotation.y = 0.7; part.position.x = 2;
    const local = new THREE.Vector3(0.3, 0, 1); const before = local.clone();
    for (const x of [1, 4, -2]) { outer.position.x = x; const actual = answered(freshWorldPoint(part, local)); expect(actual.distanceTo(part.localToWorld(local.clone()))).toBeLessThan(1e-6); }
    expect(local.equals(before)).toBe(true);
  });
});
