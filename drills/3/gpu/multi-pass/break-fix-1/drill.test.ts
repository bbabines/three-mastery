import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { passCost } from './drill';

describe('gpu.multi-pass', () => {
  it('repairs the reported symptom for a general case', () => {
    expect(passCost(800,600,3)).toEqual({fullScreenFragments:1440000,needsOutputPass:true});
  });
});
