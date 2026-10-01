import {expect} from 'vitest';
import {Vector2} from 'three';
import type {vignetteRadius} from './drill';
export function checkRepair(repair:typeof vignetteRadius):void {
 const size=new Vector2(200,100);
 expect(repair(new Vector2(200,100),size,2)).toBeCloseTo(0);
}
