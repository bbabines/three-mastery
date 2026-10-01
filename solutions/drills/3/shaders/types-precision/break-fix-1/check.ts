import {expect} from 'vitest';

import type {glslFloat} from './drill';
export function checkRepair(repair:typeof glslFloat):void {

 expect(repair(1)).toBe("1.0");
}
