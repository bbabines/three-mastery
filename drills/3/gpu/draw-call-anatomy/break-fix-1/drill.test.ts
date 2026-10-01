import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { drawSubmissions } from './drill';

describe('gpu.draw-call-anatomy', () => {
  it('repairs the reported symptom for a general case', () => {
    expect(drawSubmissions([{groups:3,visible:true},{groups:1,visible:true},{groups:5,visible:false}],2)).toBe(12);
  });
});
