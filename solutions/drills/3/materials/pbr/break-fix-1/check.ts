import type { productFinish } from './drill';
import { expect } from 'vitest';

export function checkRepair(repair: typeof productFinish): void {
 expect(repair('coat').metalness).toBe(0);
}
