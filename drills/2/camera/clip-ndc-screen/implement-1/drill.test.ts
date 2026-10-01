import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { ndcToPixel } from './drill';

describe('camera.clip-ndc-screen', () => {
  it('place a projected ndc point on a css pixel canvas, flipping the vertical direction to match the page', () => {
    const ndc=new THREE.Vector3(0.25,-0.5,0.2), before=ndc.clone();
    const p=answered(ndcToPixel(ndc,800,600));
    expect(p.distanceTo(new THREE.Vector3(500,450,0.2))).toBeLessThan(1e-6);
    expect(answered(ndcToPixel(new THREE.Vector3(-1,1,0),800,600)).distanceTo(new THREE.Vector3(0,0,0))).toBeLessThan(1e-6);
    expect(ndc.equals(before)).toBe(true);
  });
});
