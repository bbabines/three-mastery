import {expect} from 'vitest';

import type {maskFragmentRuns} from './drill';
export function checkRepair(repair:typeof maskFragmentRuns):void {

 expect(repair(1000,3,.75)).toBe(3000);
}
