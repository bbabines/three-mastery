import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { separateFaces } from './drill';

describe('geometry.indexed', () => {
  it('make a copy of indexed geometry whose triangles have separate vertices so each face can carry its own color', () => {
    const g=new THREE.BoxGeometry(); const before=g.index!.count; const copy=answered(separateFaces(g));
    expect(copy.index).toBeNull(); expect(copy.getAttribute('position').count).toBe(before);
    expect(g.index).not.toBeNull();
  });
});
