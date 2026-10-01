import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { depthWork } from './drill';

describe('gpu.depth-early-z', () => {
  it('repairs the reported symptom for a general case', () => {
    expect(depthWork(100,300,80)).toEqual({fragmentCandidates:480,earlyRejected:300,lateShaded:180});
  });
});
