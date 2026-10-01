import { Euler, Quaternion, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { blendOrientation } from './drill';

function expected(from: Euler, to: Euler, t: number) {
  return new Quaternion().slerpQuaternions(new Quaternion().setFromEuler(from), new Quaternion().setFromEuler(to), t);
}

describe('blendOrientation', () => {
  it('takes the short turn across the ±π boundary', () => {
    const from = new Euler(0, 170 * Math.PI / 180, 0, 'YXZ');
    const to = new Euler(0, -170 * Math.PI / 180, 0, 'YXZ');
    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      expect(blendOrientation(from, to, t).angleTo(expected(from, to, t))).toBeLessThan(1e-5);
    }
  });

  it('works for tilted orientations too', () => {
    const from = new Euler(0.4, 1.2, -0.3, 'YXZ');
    const to = new Euler(-0.2, -1.6, 0.8, 'YXZ');
    const result = blendOrientation(from, to, 0.35);
    const forward = new Vector3(0, 0, -1).applyQuaternion(result);
    const expectedForward = new Vector3(0, 0, -1).applyQuaternion(expected(from, to, 0.35));
    expect(forward.distanceTo(expectedForward)).toBeLessThan(1e-5);
    expect(result.length()).toBeCloseTo(1);
  });

  it('does not change the input angles', () => {
    const from = new Euler(0.4, 1.2, -0.3, 'YXZ');
    const to = new Euler(-0.2, -1.6, 0.8, 'YXZ');
    const saved = [from.clone(), to.clone()];
    blendOrientation(from, to, 0.4);
    expect([from.x, from.y, from.z, from.order, to.x, to.y, to.z, to.order]).toEqual([
      saved[0].x, saved[0].y, saved[0].z, saved[0].order, saved[1].x, saved[1].y, saved[1].z, saved[1].order,
    ]);
  });
});
