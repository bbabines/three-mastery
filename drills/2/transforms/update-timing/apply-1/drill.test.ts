import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { freshBoundsCenter } from './drill';

describe('transforms.update-timing', () => {
  it('put a marker at the world center of a part directly after the part or one of its parents moves', () => {
    const parent = new THREE.Group(); const part = new THREE.Object3D(); parent.add(part); part.position.set(1, 2, 3);
    const center = new THREE.Vector3(0.5, 0, -0.5); const before = center.clone();
    for (const angle of [0, 0.7, -0.5]) { parent.rotation.y = angle; expect(answered(freshBoundsCenter(part, center)).distanceTo(part.localToWorld(center.clone()))).toBeLessThan(1e-6); }
    expect(center.equals(before)).toBe(true);
  });
});
