import { answered } from '@harness/check';
import { Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { stepParticle } from './drill';

describe('stepParticle', () => {
  it('moves by the new velocity with stable drag and preserves inputs', () => {
    const p = new Vector3(1, 2, 3), v = new Vector3(2, 0, 0), a = new Vector3(0, -4, 0);
    const result = answered(stepParticle(p, v, a, 0.5, 0.25));
    const expectedVelocity = v.clone().addScaledVector(a, 0.25).multiplyScalar(Math.exp(-0.125));
    expect(result.velocity.distanceTo(expectedVelocity)).toBeLessThan(1e-6);
    expect(result.position.distanceTo(p.clone().addScaledVector(expectedVelocity, 0.25))).toBeLessThan(1e-6);
    expect(p).toEqual(new Vector3(1, 2, 3)); expect(v).toEqual(new Vector3(2, 0, 0)); expect(a).toEqual(new Vector3(0, -4, 0));
  });
});
