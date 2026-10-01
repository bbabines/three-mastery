import { answered } from '@harness/check';
import { describe, expect, it } from 'vitest';
import { shaderRuns } from './drill';
describe('shaderRuns', () => {
 it('scales fragment work with area and overdraw', () => {
  expect(answered(shaderRuns(1000, 10000, 1, 1, 1))).toEqual({vertex:1000,fragment:10000});
  expect(answered(shaderRuns(1000, 10000, 2, 3, 1))).toEqual({vertex:1000,fragment:120000});
 });
 it('repeats vertex work in each pass independently of DPR', () => {
  expect(answered(shaderRuns(240, 2000, 1.5, 2, 3))).toEqual({vertex:720,fragment:9000});
 });
});
