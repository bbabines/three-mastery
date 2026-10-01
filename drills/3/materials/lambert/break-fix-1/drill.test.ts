import { Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { matteLight } from './drill';
describe('matteLight',()=>{
 it('does not change when only the viewer moves',()=>{const n=new Vector3(0,2,0),l=new Vector3(3,4,0);expect(matteLight(n,l,new Vector3(0,1,0))).toBeCloseTo(matteLight(n,l,new Vector3(4,1,0)));expect(matteLight(n,l,new Vector3(4,1,0))).toBeCloseTo(.8);});
 it('clamps the unlit side and leaves vectors alone',()=>{const n=new Vector3(0,2,0),l=new Vector3(0,-4,0),v=new Vector3(1,2,0);matteLight(n,l,v);expect(matteLight(n,l,v)).toBe(0);expect([n.y,l.y,v.x]).toEqual([2,-4,1]);});
});
