import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { frameWork } from './drill';

describe('gpu.pipeline-stages', () => {
  it('repairs the reported symptom for a general case', () => {
    expect(frameWork(100,900,600,2)).toEqual({vertexRuns:200,fragmentRuns:1800,pixelsWritten:600});
  });
});
