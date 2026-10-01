import {expect} from 'vitest';

import type {shaderRuns} from './drill';
export function checkRepair(repair:typeof shaderRuns):void {

 expect(repair(200,1000,2,3,2).fragment).toBe(12000);
}
