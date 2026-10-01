import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { frameWork } from './drill';

describe('gpu.pipeline-stages', () => {
  it('counts shaded candidates separately from surviving pixels', () => {
    expect(frameWork(100,900,600,2)).toEqual({vertexRuns:200,fragmentRuns:1800,pixelsWritten:600});
    expect(frameWork(6,200,200,3)).toEqual({vertexRuns:18,fragmentRuns:600,pixelsWritten:0});
  });
});
