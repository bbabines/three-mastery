import { describe, expect, it } from 'vitest';
import { planFrame } from './drill';
describe('frame planner',()=>{
 it('skips idle and hidden redraws but keeps a visible change',()=>{
  expect(planFrame(false,true,1.5,0,0)).toEqual({render:false,dpr:1.5});
  expect(planFrame(true,true,1.5,0,0)).toEqual({render:true,dpr:1.5});
  expect(planFrame(true,false,1.5,0,0)).toEqual({render:false,dpr:1.5});
 });
 it('steps quality only after sustained measured frame times',()=>{
  expect(planFrame(false,true,1.5,2,0)).toEqual({render:false,dpr:1.5});
  expect(planFrame(false,true,1.5,3,0)).toEqual({render:true,dpr:1.25});
  expect(planFrame(false,true,1.5,0,7)).toEqual({render:false,dpr:1.5});
  expect(planFrame(false,true,1.5,0,8)).toEqual({render:true,dpr:1.75});
  expect(planFrame(false,true,1,3,0).dpr).toBe(1);
  expect(planFrame(false,true,2,0,8).dpr).toBe(2);
 });
});
