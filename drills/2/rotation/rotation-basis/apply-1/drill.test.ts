import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { cameraRight } from './drill';

describe('rotation.rotation-basis', () => {
  it('reads current world right through a turned parent at vertical pitch', () => {
    const parent = new THREE.Group(), camera = new THREE.PerspectiveCamera();
    parent.add(camera); parent.rotation.set(0.2, 0.4, 0.3);
    for (const pitch of [0, Math.PI / 2 - 0.001, -Math.PI / 2 + 0.001]) {
      camera.rotation.x = pitch;
      parent.rotation.y += 0.13; // world matrices have not been refreshed yet
      const expected = new THREE.Vector3(1, 0, 0).applyQuaternion(
        parent.quaternion.clone().multiply(camera.quaternion),
      );
      const actual = answered(cameraRight(camera));
      expect(actual.distanceTo(expected)).toBeLessThan(1e-6);
      expect(actual.length()).toBeCloseTo(1, 6);
    }
  });
});
