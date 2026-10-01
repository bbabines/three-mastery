import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { smoothMove } from './drill';

describe('interaction.frame-rate-independence', () => {
  it('repairs the reported symptom for a general case', () => {
    const one=smoothMove(0,10,8,0.1), two=smoothMove(smoothMove(0,10,8,0.05),10,8,0.05);
    expect(one).toBeCloseTo(two,6); expect(one).toBeGreaterThan(0);
  });
});
