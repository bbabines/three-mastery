import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { screenY } from './drill';

describe('camera.clip-ndc-screen', () => {
  it('repairs the reported symptom for a general case', () => {
    for (const [ndc,pixel] of [[1,0],[0,300],[-1,600],[0.5,150]]) expect(screenY(ndc,600)).toBeCloseTo(pixel,6);
  });
});
