import { answered } from '@harness/check';
import { Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { lambertResponse } from './drill';
describe('lambertResponse', () => {
 it('follows the cosine law on nonunit directions', () => {
  const normal = new Vector3(0, 4, 0), light = new Vector3(3, 4, 0);
  expect(answered(lambertResponse(normal, light, .7, 9))).toBeCloseTo(.7 * 9 * .8 / Math.PI, 8);
  expect(answered(lambertResponse(normal, new Vector3(0, -3, 0), .7, 9))).toBe(0);
 });
 it('leaves both input directions unchanged', () => {
  const normal = new Vector3(1, 2, 3), light = new Vector3(2, 3, 5);
  const n = normal.clone(), l = light.clone();
  answered(lambertResponse(normal, light, .3, 2));
  expect(normal.equals(n)).toBe(true); expect(light.equals(l)).toBe(true);
 });
});
