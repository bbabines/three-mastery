import { Object3D } from 'three';
import { describe, expect, it } from 'vitest';
import { withHidden } from './drill';

describe('withHidden', () => {
  it('hides only during a successful probe and returns its result', () => {
    const part = new Object3D();
    expect(withHidden(part, () => { expect(part.visible).toBe(false); return 7; })).toBe(7);
    expect(part.visible).toBe(true);
  });
  it('restores original visibility when the probe throws', () => {
    for (const initiallyVisible of [true, false]) {
      const part = new Object3D(); part.visible = initiallyVisible;
      expect(() => withHidden(part, () => { throw new Error('probe failed'); })).toThrow('probe failed');
      expect(part.visible).toBe(initiallyVisible);
    }
  });
});
