import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { flipNormalGreen } from './drill';

describe('geometry.tangent-space', () => {
  it('convert a directx-style −y normal-map sample to the +y convention used by three', () => {
    const sample=new THREE.Vector3(0.3,0.2,0.9), before=sample.clone();
    const converted=answered(flipNormalGreen(sample));
    expect(converted.distanceTo(new THREE.Vector3(0.3,0.8,0.9))).toBeLessThan(1e-6);
    expect(answered(flipNormalGreen(converted)).distanceTo(sample)).toBeLessThan(1e-6);
    expect(sample.equals(before)).toBe(true);
  });
});
