import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import * as check from './check';

describe('gpu.renderer-tour', () => {
  it('makes the right judgment', () => {
    expect(answered(check.cappedDpr(3,2))).toBe(2);
  });
});

describe('gpu.pipeline-stages', () => {
  it('makes the right judgment', () => {
    expect(answered(check.fragmentWork(1000,3))).toBe(3000);
  });
});

describe('gpu.draw-call-anatomy', () => {
  it('makes the right judgment', () => {
    expect(answered(check.drawCallsForGroups(10,3))).toBe(30);
  });
});

describe('gpu.state-sorting', () => {
  it('makes the right judgment', () => {
    const shared=new THREE.MeshBasicMaterial(), other=new THREE.MeshBasicMaterial(); const a=new THREE.Mesh(undefined,shared), b=new THREE.Mesh(undefined,other), c=new THREE.Mesh(undefined,shared); const sorted=answered(check.sortMaterials([a,b,c])); expect(Math.abs(sorted.indexOf(a)-sorted.indexOf(c))).toBe(1);
  });
});

describe('gpu.depth-early-z', () => {
  it('makes the right judgment', () => {
    expect(answered(check.canRejectEarly(true,true))).toBe(true); expect(answered(check.canRejectEarly(false,true))).toBe(false);
  });
});

describe('gpu.stencil', () => {
  it('makes the right judgment', () => {
    const m=new THREE.MeshBasicMaterial(); expect(answered(check.enableStencilMask(m,3))).toBe(3); expect(m.stencilWrite).toBe(true);
  });
});

describe('gpu.blending', () => {
  it('makes the right judgment', () => {
    const m=new THREE.MeshBasicMaterial(); expect(answered(check.enableTransparency(m))).toBe(true); expect(m.version).toBeGreaterThan(0);
  });
});

describe('gpu.render-targets', () => {
  it('makes the right judgment', () => {
    const t=answered(check.offscreenTarget(64,32)); expect(t.width).toBe(64); expect(t.height).toBe(32); t.dispose();
  });
});

describe('gpu.multi-pass', () => {
  it('makes the right judgment', () => {
    expect(answered(check.totalPassDraws(10,[2,1,4]))).toBe(17);
  });
});

describe('gpu.multisampling', () => {
  it('makes the right judgment', () => {
    const t=new THREE.WebGLRenderTarget(10,10); t.samples=4; expect(answered(check.samplesUsed(t))).toBe(4);
  });
});

describe('gpu.readback', () => {
  it('makes the right judgment', () => {
    expect(answered(check.rgbaReadBytes(100,50))).toBe(20000);
  });
});

describe('gpu.frame-budget', () => {
  it('makes the right judgment', () => {
    expect(answered(check.exceedsBudget(20,16))).toBe(true); expect(answered(check.exceedsBudget(10,16))).toBe(false);
  });
});

describe('gpu.measurement', () => {
  it('makes the right judgment', () => {
    const info={render:{calls:7}} as THREE.WebGLInfo; expect(answered(check.drawCalls(info))).toBe(7);
  });
});
