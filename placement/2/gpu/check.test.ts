import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { capRendererDpr, stageWork, estimatedDraws, putOverlayLast, opaqueOccluder, stencilWriter, glassMaterial, thumbnailTarget, postFragments, msaaTarget, readIdPixel, budgetForHz, cpuRenderMs } from './check';

describe('gpu.renderer-tour', () => {
it('caps a high DPR but keeps a lower DPR', () => {
    const calls: number[] = []; const renderer = {setPixelRatio: (n: number) => {calls.push(n);}} as Pick<THREE.WebGLRenderer,'setPixelRatio'>;
    expectNumber(capRendererDpr(renderer,3,2),2); expectNumber(capRendererDpr(renderer,1.25,2),1.25);
    expect(calls).toEqual([2,1.25]);
  });
});

describe('gpu.pipeline-stages', () => {
it('separates vertices from covered fragments over multiple passes', () => {
    expect(answered(stageWork(6,1920*1080,3))).toEqual({vertex:18,fragment:1920*1080*3});
    expect(answered(stageWork(1200,80,1))).toEqual({vertex:1200,fragment:80});
  });
});

describe('gpu.draw-call-anatomy', () => {
it('counts material groups, hidden branches, and shadow submissions', () => {
    const root = new THREE.Group(); const material = [new THREE.MeshBasicMaterial(),new THREE.MeshBasicMaterial()];
    const geometry = new THREE.BoxGeometry(); geometry.clearGroups(); geometry.addGroup(0,3,0); geometry.addGroup(3,3,1);
    const grouped = new THREE.Mesh(geometry,material); grouped.castShadow=true; root.add(grouped);
    const hidden = new THREE.Group(); hidden.visible=false; hidden.add(new THREE.Mesh()); root.add(hidden);
    expectNumber(estimatedDraws(root,1),4); expectNumber(estimatedDraws(root,2),6);
  });
});

describe('gpu.state-sorting', () => {
it('sets explicit order independently of scene insertion order', () => {
    const overlay = new THREE.Mesh(); expectNumber(putOverlayLast(overlay,9),9); expect(overlay.renderOrder).toBe(9);
  });
});

describe('gpu.depth-early-z', () => {
it('restores depth testing and writes after a transparent variant', () => {
    const material = new THREE.MeshBasicMaterial({transparent:true,depthTest:false,depthWrite:false});
    const result = answered(opaqueOccluder(material)); expect(result).toBe(material);
    expect([material.transparent,material.depthTest,material.depthWrite]).toEqual([false,true,true]);
  });
});

describe('gpu.stencil', () => {
it('writes the selected stencil reference on depth pass', () => {
    const material = new THREE.MeshBasicMaterial(); const result = answered(stencilWriter(material,3));
    expect(result).toBe(material); expect(material.stencilWrite).toBe(true); expect(material.stencilRef).toBe(3);
    expect(material.stencilFunc).toBe(THREE.AlwaysStencilFunc); expect(material.stencilZPass).toBe(THREE.ReplaceStencilOp);
  });
});

describe('gpu.blending', () => {
it('keeps a translucent surface from writing opaque depth', () => {
    const material = new THREE.MeshBasicMaterial(); const result = answered(glassMaterial(material,0.35));
    expect(result).toBe(material); expect(material.opacity).toBeCloseTo(0.35);
    expect([material.transparent,material.depthTest,material.depthWrite]).toEqual([true,true,false]);
  });
});

describe('gpu.render-targets', () => {
it('creates an offscreen target with its own depth attachment', () => {
    const target = answered(thumbnailTarget(256,144));
    expect(target.width).toBe(256); expect(target.height).toBe(144); expect(target.depthBuffer).toBe(true); expect(target.stencilBuffer).toBe(false);
    target.dispose();
  });
});

describe('gpu.multi-pass', () => {
it('scales with both resolution and pass count', () => {
    expectNumber(postFragments(1920,1080,3),1920*1080*3);
    expectNumber(postFragments(960,540,3),960*540*3);
    expect(answered(postFragments(1920,1080,3))).toBe(4*answered(postFragments(960,540,3)));
  });
});

describe('gpu.multisampling', () => {
it('sets samples on the offscreen target itself', () => {
    const target = answered(msaaTarget(320,180,4)); expect(target.width).toBe(320); expect(target.height).toBe(180);
    expect(target.samples).toBe(4); target.dispose();
  });
});

describe('gpu.readback', () => {
it('requests exactly one pixel and returns the async result', async () => {
    const target = new THREE.WebGLRenderTarget(8,8); const calls: unknown[][] = []; const pixel = new Uint8Array([5,2,1,255]);
    const renderer = { readRenderTargetPixelsAsync: (...args: unknown[]) => {calls.push(args); return Promise.resolve(pixel);} } as unknown as Pick<THREE.WebGLRenderer,'readRenderTargetPixelsAsync'>;
    const result = answered(readIdPixel(renderer,target,3,4)); expect(await result).toEqual(pixel);
    expect(calls).toHaveLength(1); expect(calls[0].slice(0,5)).toEqual([target,3,4,1,1]); target.dispose();
  });
});

describe('gpu.frame-budget', () => {
it('shows that higher refresh rates leave less time per frame', () => {
    expectNumber(budgetForHz(60),1000/60); expectNumber(budgetForHz(120),1000/120);
    expect(answered(budgetForHz(120))).toBeLessThan(answered(budgetForHz(60)));
  });
});

describe('gpu.measurement', () => {
it('times around the render call in the right order', () => {
    const events: string[] = []; const times = [10,13.5];
    const now = () => {events.push('clock'); return times.shift()!;};
    const renderer = {render: () => {events.push('render');}} as Pick<THREE.WebGLRenderer,'render'>;
    expectNumber(cpuRenderMs(renderer,new THREE.Scene(),new THREE.PerspectiveCamera(),now),3.5);
    expect(events).toEqual(['clock','render','clock']);
  });
});
