import * as THREE from 'three';
import { expect } from 'vitest';
import type { frameWork } from './drill';

export function checkPipelineStages(subject: typeof frameWork): void {
  expect(subject(80,700,450,3)).toEqual({vertexRuns:240,fragmentRuns:2100,pixelsWritten:750});
}
