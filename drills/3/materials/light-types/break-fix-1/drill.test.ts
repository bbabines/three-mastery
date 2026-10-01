import { describe, expect, it } from 'vitest';

import { pointIllumination } from './drill';
describe('pointIllumination',()=>{
 it('repairs the visible behavior across inputs',()=>{
 expect(pointIllumination(400,4)).toBeCloseTo(pointIllumination(400,2)/4); expect(pointIllumination(800,3)).toBeCloseTo(pointIllumination(400,3)*2);
 });
});
