import { Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { glint } from './drill';
describe('glint',()=>{
 it('moves with viewer direction',()=>{const n=new Vector3(0,1,0),l=new Vector3(0,2,0);expect(glint(n,l,new Vector3(0,1,0),16)).toBeCloseTo(1);expect(glint(n,l,new Vector3(2,1,0),16)).toBeLessThan(.5);});
 it('narrows with higher shininess and does not mutate inputs',()=>{const n=new Vector3(0,1,0),l=new Vector3(0,1,0),v=new Vector3(1,1,0);expect(glint(n,l,v,4)).toBeGreaterThan(glint(n,l,v,64));expect(v.equals(new Vector3(1,1,0))).toBe(true);});
});
