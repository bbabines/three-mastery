import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { needsDraco, primitiveCount, loadState, preuploadTexture, chooseGeometryCodec, rgbaTextureBytes, geometryArrayBytes, cachedLoad, disposeMeshOwned, nextPreload } from './check';

describe('assets.loaders-tour', () => {
it('recognizes Draco only from the glTF extension', () => {
    expectExact(needsDraco(['KHR_draco_mesh_compression','KHR_materials_clearcoat']), true);
    expectExact(needsDraco(['EXT_meshopt_compression']), false);
  });
});

describe('assets.gltf-structure', () => {
it('counts pieces instead of assuming one Mesh per glTF mesh', () => {
    const document = { meshes: [{ primitives: [{}, {}, {}] }, { primitives: [{}] }] };
    expectNumber(primitiveCount(document, 0), 3); expectNumber(primitiveCount(document, 1), 1);
    expectNumber(primitiveCount(document, 7), 0);
  });
});

describe('assets.load-lifecycle', () => {
it('keeps failure distinct from loading and completion', () => {
    expectExact(loadState(false,false), 'loading'); expectExact(loadState(true,false), 'ready');
    expectExact(loadState(false,true), 'failed'); expectExact(loadState(true,true), 'failed');
  });
});

describe('assets.decode-upload-compile', () => {
it('asks the renderer to upload exactly the supplied texture', () => {
    const texture = new THREE.Texture(); const calls: THREE.Texture[] = [];
    const renderer = { initTexture: (item: THREE.Texture) => { calls.push(item); } } as Pick<THREE.WebGLRenderer, 'initTexture'>;
    expect(answered(preuploadTexture(renderer,texture))).toBe(texture);
    expect(calls).toEqual([texture]);
  });
});

describe('assets.draco-meshopt', () => {
it('uses decode budget rather than download size alone', () => {
    expectExact(chooseGeometryCodec(180000,90,210000,12,25), 'meshopt');
    expectExact(chooseGeometryCodec(180000,18,210000,12,25), 'draco');
  });
});

describe('assets.ktx2', () => {
it('counts decoded RGBA pixels, including all mip levels', () => {
    expectNumber(rgbaTextureBytes(4,4,false), 4*4*4);
    expectNumber(rgbaTextureBytes(4,4,true), (16+4+1)*4);
    expectNumber(rgbaTextureBytes(8,2,true), (16+4+2+1)*4);
  });
});

describe('assets.memory-math', () => {
it('counts interleaved storage once and includes the index', () => {
    const geometry = new THREE.BufferGeometry(); const data = new THREE.InterleavedBuffer(new Float32Array(12),6);
    geometry.setAttribute('position', new THREE.InterleavedBufferAttribute(data,3,0));
    geometry.setAttribute('normal', new THREE.InterleavedBufferAttribute(data,3,3));
    geometry.setIndex([0,1,2]);
    const expected = data.array.byteLength + geometry.index!.array.byteLength;
    expectNumber(geometryArrayBytes(geometry), expected);
  });
});

describe('assets.reuse-caching', () => {
it('starts only one load for repeated parts', async () => {
    const cache = new Map<string,Promise<string>>(); let calls = 0;
    const load = (url: string) => { calls++; return Promise.resolve(url); };
    const first = answered(cachedLoad('/rack.glb',cache,load));
    const second = answered(cachedLoad('/rack.glb',cache,load));
    expect(first).toBe(second); expect(await second).toBe('/rack.glb'); expect(calls).toBe(1);
  });
});

describe('assets.disposal', () => {
it('disposes owned material and texture but preserves shared geometry', () => {
    const geometry = new THREE.BoxGeometry(); const texture = new THREE.Texture(); const material = new THREE.MeshStandardMaterial({map:texture});
    const mesh = new THREE.Mesh(geometry,material); const disposed: string[] = [];
    geometry.addEventListener('dispose',()=>disposed.push('geometry'));
    material.addEventListener('dispose',()=>disposed.push('material'));
    texture.addEventListener('dispose',()=>disposed.push('texture'));
    expectNumber(disposeMeshOwned(mesh,new Set([geometry])),2);
    expect(disposed.sort()).toEqual(['material','texture']);
  });
});

describe('assets.preload-lazy', () => {
it('avoids an unlikely or over-budget preload', () => {
    const items = [{url:'huge',likely:true,bytes:900},{url:'rare',likely:false,bytes:10},{url:'next',likely:true,bytes:80}];
    expectExact(nextPreload(items,100), 'next'); expectExact(nextPreload(items,20), '');
  });
});
