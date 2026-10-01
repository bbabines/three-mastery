import { describe, expect, it } from 'vitest';
import { pointerNdc } from './drill';
describe('pointerNdc', () => {
  it('uses the canvas rectangle in CSS pixels at any DPR', () => {
    const rect = { left: 120, top: 70, width: 400, height: 200 };
    for (const dpr of [1, 2.5, 3]) {
      const center = pointerNdc(320, 170, rect, dpr);
      expect(center.x).toBeCloseTo(0); expect(center.y).toBeCloseTo(0);
      const quarter = pointerNdc(220, 120, rect, dpr);
      expect(quarter.x).toBeCloseTo(-0.5); expect(quarter.y).toBeCloseTo(0.5);
    }
  });
});
