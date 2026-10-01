import { describe, expect, it } from 'vitest';
import {Vector3} from 'three';
import { readOrm } from './drill';
describe('readOrm',()=>{
 it('repairs the visible behavior across inputs',()=>{
 expect(readOrm(new Vector3(.1,.8,.3))).toEqual({ao:.1,roughness:.8,metalness:.3});expect(readOrm(new Vector3(.2,.4,.7)).roughness).not.toBe(readOrm(new Vector3(.2,.9,.7)).roughness);
 });
});
