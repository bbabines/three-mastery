import { expect } from 'vitest';
import type { planFrame } from './drill';
export function checkIdleFrame(plan: typeof planFrame): void {
 for(const dpr of [1,1.25,2]){
  expect(plan(false,true,dpr,0,0)).toEqual({render:false,dpr});
  expect(plan(true,true,dpr,0,0).render).toBe(true);
 }
 expect(plan(false,true,1.5,3,0)).toEqual({render:true,dpr:1.25});
}
