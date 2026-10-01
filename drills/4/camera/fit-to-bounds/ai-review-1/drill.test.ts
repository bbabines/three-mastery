import { expectNumber } from '@harness/check';
import { MathUtils } from 'three';
import { describe, it } from 'vitest';
import { fitSphere } from './drill';
describe('fitSphere', () => {
  it('fits a sphere in narrow and wide viewports', () => {
    for (const [radius, fov, aspect] of [[2, 50, 0.5], [3, 60, 0.75], [2, 45, 2], [1.5, 70, 1.5]]) {
      const vertical = MathUtils.degToRad(fov) / 2;
      const horizontal = Math.atan(Math.tan(vertical) * aspect);
      expectNumber(fitSphere(radius, fov, aspect), radius / Math.sin(Math.min(vertical, horizontal)));
    }
  });
});
