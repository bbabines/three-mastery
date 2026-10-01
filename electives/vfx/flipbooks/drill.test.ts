import { answered } from '@harness/check';
import { Vector2 } from 'three';
import { describe, expect, it } from 'vitest';
import { frameUv } from './drill';

describe('frameUv', () => {
  it('uses the lower-left UV origin and wraps frames without changing the caller input', () => {
    const uv = new Vector2(0.25, 0.75);
    expect(answered(frameUv(uv, 0, 4, 2))).toEqual(new Vector2(0.0625, 0.375));
    expect(answered(frameUv(uv, 5, 4, 2))).toEqual(new Vector2(0.3125, 0.875));
    expect(answered(frameUv(uv, 13, 4, 2))).toEqual(answered(frameUv(uv, 5, 4, 2)));
    expect(uv).toEqual(new Vector2(0.25, 0.75));
  });
});
