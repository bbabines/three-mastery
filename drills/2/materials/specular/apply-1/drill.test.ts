import { answered } from '@harness/check';
import { Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { blinnHighlight } from './drill';
describe('blinnHighlight', () => {
 it('changes with view and narrows at higher shininess', () => {
  const n = new Vector3(0,1,0), l = new Vector3(0,2,0), front = new Vector3(0,3,0), side = new Vector3(3,1,0);
  expect(answered(blinnHighlight(n,l,front,32))).toBeCloseTo(1);
  const broad = answered(blinnHighlight(n,l,side,4));
  const narrow = answered(blinnHighlight(n,l,side,64));
  expect(broad).toBeGreaterThan(narrow);
  expect(narrow).toBeGreaterThanOrEqual(0);
 });
 it('does not modify input vectors', () => {
  const n = new Vector3(1,2,3), l = new Vector3(2,3,4), v = new Vector3(3,4,5);
  const copies = [n.clone(),l.clone(),v.clone()]; answered(blinnHighlight(n,l,v,8));
  expect(n.equals(copies[0]) && l.equals(copies[1]) && v.equals(copies[2])).toBe(true);
 });
});
