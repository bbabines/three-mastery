import { answered, expectUnchanged, expectVector } from '@harness/check';
import { Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { slideAndBounce } from './drill';

describe('slideAndBounce', () => {
  it('slides along a slanted wall and keeps bounce length with a long normal', () => {
    const incoming = new Vector3(1.3, -0.4, -0.2);
    const normal = new Vector3(1, 0.3, 1).multiplyScalar(4);
    const result = answered(slideAndBounce(incoming, normal));
    expectVector(result.slide, incoming.clone().projectOnPlane(normal));
    expectVector(result.bounce, incoming.clone().reflect(normal.clone().normalize()));
    expect(result.bounce.length()).toBeCloseTo(incoming.length());
  });

  it('works with a short non-unit normal too', () => {
    const incoming = new Vector3(-0.5, 0.7, 1.5);
    const normal = new Vector3(0.1, 0.2, 0.1);
    const result = answered(slideAndBounce(incoming, normal));
    expectVector(result.slide, incoming.clone().projectOnPlane(normal));
    expectVector(result.bounce, incoming.clone().reflect(normal.clone().normalize()));
  });

  it('does not change either input', () => {
    const incoming = new Vector3(1, -2, 3);
    const normal = new Vector3(2, 0, 1);
    slideAndBounce(incoming, normal);
    expectUnchanged(incoming, new Vector3(1, -2, 3), 'incoming');
    expectUnchanged(normal, new Vector3(2, 0, 1), 'normal');
  });
});
