import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { headroomMs } from './drill';

describe('gpu.frame-budget', () => {
  it('repairs the reported symptom for a general case', () => {
    expect(headroomMs(9,11,60)).toBeCloseTo(1000/60-11,6); expect(headroomMs(4,10,120)).toBeLessThan(0);
  });
});
