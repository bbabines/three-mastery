import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import * as check from './check';

describe('optimization.draw-call-reduction', () => {
  it('makes the right judgment', () => {
    const g=new THREE.BoxGeometry(),m=new THREE.MeshBasicMaterial(); expect(answered(check.canInstanceTogether(new THREE.Mesh(g,m),new THREE.Mesh(g,m)))).toBe(true);
  });
});

describe('optimization.resolution-dpr', () => {
  it('makes the right judgment', () => {
    expect(answered(check.pixelCount(400,800,3))).toBe(2880000);
  });
});

describe('optimization.render-on-demand', () => {
  it('makes the right judgment', () => {
    expect(answered(check.needsRender(false,false))).toBe(false); expect(answered(check.needsRender(true,false))).toBe(true);
  });
});

describe('optimization.allocation-hygiene', () => {
  it('makes the right judgment', () => {
    const v=new THREE.Vector3(); expect(answered(check.reusePoint(v,1,2,3))).toBe(v); expect(v.z).toBe(3);
  });
});

describe('optimization.culling-lod', () => {
  it('makes the right judgment', () => {
    expect(answered(check.useLowDetail(20,10))).toBe(true); expect(answered(check.useLowDetail(5,10))).toBe(false);
  });
});

describe('optimization.overdraw', () => {
  it('makes the right judgment', () => {
    expect(answered(check.shadedFragments(1000,4))).toBe(4000);
  });
});

describe('optimization.shader-cost', () => {
  it('makes the right judgment', () => {
    expect(answered(check.shaderWork(1000,2,5))).toBe(10000);
  });
});

describe('optimization.texture-budget', () => {
  it('makes the right judgment', () => {
    expect(answered(check.textureBytes(1024,1024,4,1))).toBe(4194304);
  });
});

describe('optimization.hitch-avoidance', () => {
  it('makes the right judgment', () => {
    expect(answered(check.prewarmNeeded(false,true))).toBe(true); expect(answered(check.prewarmNeeded(false,false))).toBe(false);
  });
});

describe('optimization.leak-detection', () => {
  it('makes the right judgment', () => {
    expect(answered(check.grewAfterCycle(10,11))).toBe(true); expect(answered(check.grewAfterCycle(10,10))).toBe(false);
  });
});

describe('optimization.adaptive-quality', () => {
  it('makes the right judgment', () => {
    expect(answered(check.nextDpr(2,20,16,1))).toBe(1.75); expect(answered(check.nextDpr(1,20,16,1))).toBe(1);
  });
});
