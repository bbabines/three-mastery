import {describe,expect,it} from 'vitest';
import {Vector2} from 'three';
import {vignetteRadius} from './drill';
describe('vignetteRadius',()=>{it('repairs the effect across inputs',()=>{ const size=new Vector2(200,100);expect(vignetteRadius(new Vector2(200,100),size,2)).toBeCloseTo(0);expect(vignetteRadius(new Vector2(100,50),size,1)).toBeCloseTo(0);expect(vignetteRadius(new Vector2(0,0),size,2)).toBeCloseTo(.5); });});
