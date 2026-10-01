import { answered } from '@harness/check';
import { Mesh, MeshStandardMaterial, Texture } from 'three';
import { describe, expect, it } from 'vitest';
import { swapFinish } from './drill';

describe('twenty finish swaps', () => {
  it('disposes each owned old finish but keeps a shared map', () => {
    const shared = new Texture();
    const mesh = new Mesh();
    const ownedMaterials = new Set<MeshStandardMaterial>();
    const ownedTextures = new Set<Texture>();
    let materialsDisposed=0, texturesDisposed=0, sharedDisposed=0;
    shared.addEventListener('dispose',() => sharedDisposed++);
    for(let i=0;i<21;i++) {
      const map = new Texture();
      map.addEventListener('dispose',() => texturesDisposed++);
      const material = new MeshStandardMaterial({map,roughnessMap:shared});
      material.addEventListener('dispose',() => materialsDisposed++);
      ownedMaterials.add(material); ownedTextures.add(map);
      if(i===0) mesh.material=material;
      else expect(answered(swapFinish(mesh,material,ownedMaterials,ownedTextures))).toBe(true);
    }
    expect(materialsDisposed).toBe(20);
    expect(texturesDisposed).toBe(20);
    expect(sharedDisposed).toBe(0);
    expect(ownedMaterials.size).toBe(1);
    expect(ownedTextures.size).toBe(1);
  });
  it('leaves unowned and reused resources alive', () => {
    const old = new MeshStandardMaterial();
    const mesh = new Mesh(undefined,old);
    let disposed=0;
    old.addEventListener('dispose',() => disposed++);
    expect(answered(swapFinish(mesh,old,new Set(),new Set()))).toBe(true);
    expect(disposed).toBe(0);
    const next = new MeshStandardMaterial();
    expect(answered(swapFinish(mesh,next,new Set(),new Set()))).toBe(true);
    expect(disposed).toBe(0);
  });
});
