import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import * as check from './check';

describe('assets.loaders-tour', () => {
  it('makes the right judgment', () => {
    const t=new THREE.Texture(); t.colorSpace=THREE.SRGBColorSpace; expect(answered(check.colorTexture(t))).toBe(true);
  });
});

describe('assets.gltf-structure', () => {
  it('makes the right judgment', () => {
    const root=new THREE.Group(), mesh=new THREE.Mesh(); mesh.name='bracket'; root.add(mesh); expect(answered(check.namedMesh(root,'bracket'))).toBe(mesh);
  });
});

describe('assets.load-lifecycle', () => {
  it('makes the right judgment', () => {
    const t=new THREE.Texture(); t.source.data=null; expect(answered(check.hasTextureData(t))).toBe(false); t.source.data={width:1,height:1}; expect(answered(check.hasTextureData(t))).toBe(true);
  });
});

describe('assets.decode-upload-compile', () => {
  it('makes the right judgment', () => {
    expect(answered(check.needsFirstUseWarmup(true,false,true))).toBe(true); expect(answered(check.needsFirstUseWarmup(true,true,true))).toBe(false);
  });
});

describe('assets.draco-meshopt', () => {
  it('makes the right judgment', () => {
    expect(answered(check.decoderChoice(true,true))).toBe('meshopt'); expect(answered(check.decoderChoice(true,false))).toBe('draco');
  });
});

describe('assets.ktx2', () => {
  it('makes the right judgment', () => {
    expect(answered(check.isGpuCompressed(new THREE.CompressedTexture([],4,4)))).toBe(true); expect(answered(check.isGpuCompressed(new THREE.Texture()))).toBe(false);
  });
});

describe('assets.memory-math', () => {
  it('makes the right judgment', () => {
    expect(answered(check.rgbaBytes(4,4,true))).toBe(64+16+4); expect(answered(check.rgbaBytes(4,4,false))).toBe(64);
  });
});

describe('assets.reuse-caching', () => {
  it('makes the right judgment', () => {
    const g=new THREE.BoxGeometry(); expect(answered(check.sharesGeometry(new THREE.Mesh(g),new THREE.Mesh(g)))).toBe(true);
  });
});

describe('assets.disposal', () => {
  it('makes the right judgment', () => {
    const m=new THREE.MeshBasicMaterial(); let count=0; m.addEventListener('dispose',()=>count++); expect(answered(check.disposeIfOwned(m,new Set([m])))).toBe(true); expect(count).toBe(1);
  });
});

describe('assets.preload-lazy', () => {
  it('makes the right judgment', () => {
    expect(answered(check.shouldPreload(true,10,20))).toBe(true); expect(answered(check.shouldPreload(false,10,20))).toBe(false); expect(answered(check.shouldPreload(true,30,20))).toBe(false);
  });
});
