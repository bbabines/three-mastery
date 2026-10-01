import { expect } from 'vitest';

import type { pointIllumination } from './drill';
export function checkRepair(repair: typeof pointIllumination): void {

 expect(repair(400,4)).toBeCloseTo(repair(400,2)/4);
}
