import {expect} from 'vitest';

import type {shaderRuns} from './drill';
export function checkRepair(repair:typeof shaderRuns):void {
 const oneLayer=repair(200,1000,2,1,2);
 const threeLayers=repair(200,1000,2,3,2);
 expect(oneLayer.fragment).toBe(1000*2*2*2);
 expect(threeLayers.fragment).toBe(oneLayer.fragment*3);
}
