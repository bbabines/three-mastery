import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { lodLevel, makeCutout } from './drill';

describe('lodLevel', () => {
it('steps through distance thresholds at their boundaries', () => {
    const thresholds=[5,15,40]; expectNumber(lodLevel(4.9,thresholds),0); expectNumber(lodLevel(5,thresholds),1);
    expectNumber(lodLevel(20,thresholds),2); expectNumber(lodLevel(80,thresholds),3); expect(thresholds).toEqual([5,15,40]);
  });
});

describe('makeCutout', () => {
it('keeps surviving cutout pixels in the depth buffer', () => {
    const material=new THREE.MeshBasicMaterial({transparent:true,depthWrite:false});
    const result=answered(makeCutout(material,0.5)); expect(result).toBe(material);
    expect(material.alphaTest).toBeCloseTo(0.5); expect(material.transparent).toBe(false); expect(material.depthWrite).toBe(true);
  });
});
