import * as THREE from 'three';
import { expect } from 'vitest';
import type { depthWork } from './drill';

export function checkDepthEarlyZ(subject: typeof depthWork): void {
  expect(subject(500,900,125)).toEqual({fragmentCandidates:1525,earlyRejected:900,lateShaded:625});
}
