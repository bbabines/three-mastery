import { answered } from '@harness/check';
import { Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { toonDiffuse } from './drill';
describe('toonDiffuse', () => {
 it('selects bands by angle, not vector length', () => {
  expect(answered(toonDiffuse(new Vector3(0, 2, 0), new Vector3(3, 4, 0), .7))).toBe(1);
  expect(answered(toonDiffuse(new Vector3(0, 2, 0), new Vector3(4, 3, 0), .7))).toBe(.2);
  expect(answered(toonDiffuse(new Vector3(0, 2, 0), new Vector3(0, -2, 0), .1))).toBe(.2);
 });
 it('does not change directions', () => {
  const n = new Vector3(0, 2, 1), l = new Vector3(3, 4, 5), copy=n.clone(), copyL=l.clone();
  answered(toonDiffuse(n,l,.6)); expect(n.equals(copy)).toBe(true); expect(l.equals(copyL)).toBe(true);
 });
});
