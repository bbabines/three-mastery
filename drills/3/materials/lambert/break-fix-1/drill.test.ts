import { Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { matteLight } from './drill';
describe('matteLight',()=>{
 it('does not change when only the viewer moves',()=>{
  const normal=new Vector3(0,2,0), toLight=new Vector3(3,4,0);
  const expected=Math.max(0,normal.clone().normalize().dot(toLight.clone().normalize()));
  for(const toView of [new Vector3(0,1,0),new Vector3(4,1,0),new Vector3(-2,3,1)]){
   expect(matteLight(normal,toLight,toView)).toBeCloseTo(expected);
  }
 });
 it('clamps the unlit side and leaves every input unchanged',()=>{
  const normal=new Vector3(0,2,1), toLight=new Vector3(0,-4,-3), toView=new Vector3(1,2,3);
  const before=[normal.clone(),toLight.clone(),toView.clone()];
  expect(matteLight(normal,toLight,toView)).toBe(0);
  expect([normal,toLight,toView]).toEqual(before);
 });
});
