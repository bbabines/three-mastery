import { answered } from '@harness/check';
import { DoubleSide, FrontSide, LinearMipmapLinearFilter, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, NeutralToneMapping, NoColorSpace, Scene, SRGBColorSpace, Texture, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { unlitType, areaLit, mapSpace, productTone, diffuseCosine, halfVector, finishMetalness, pointIrradiance, addEnvironment, shadowTexelsPerUnit, useSecondUv, mipFilter, unpackOrm, oneSided } from './check';
describe('materials.materials-tour', () => {
 it('Choose a material family for a lit or unlit label.', () => { expect(answered(unlitType(false))).toBe("basic"); expect(answered(unlitType(true))).toBe("standard"); });
});
describe('materials.lights-tour', () => {
 it('Whether RectAreaLight can light this material.', () => { expect(answered(areaLit(new MeshStandardMaterial()))).toBe(true); expect(answered(areaLit(new MeshPhysicalMaterial()))).toBe(true); expect(answered(areaLit(new MeshBasicMaterial()))).toBe(false); });
});
describe('materials.color-spaces', () => {
 it('The texture color space for this map channel.', () => { expect(answered(mapSpace("color"))).toBe(SRGBColorSpace); expect(answered(mapSpace("normal"))).toBe(NoColorSpace); expect(answered(mapSpace("roughness"))).toBe(NoColorSpace); });
});
describe('materials.tone-mapping', () => {
 it('The tone mapping that keeps product colors close to source.', () => { expect(answered(productTone())).toBe(NeutralToneMapping); });
});
describe('materials.lambert', () => {
 it('Clamped Lambert cosine for arbitrary-length vectors.', () => { expect(answered(diffuseCosine(new Vector3(0,3,0),new Vector3(4,3,0)))).toBeCloseTo(.6); expect(answered(diffuseCosine(new Vector3(0,1,0),new Vector3(0,-1,0)))).toBe(0); });
});
describe('materials.specular', () => {
 it('Normalized Blinn half vector.', () => { expect(answered(halfVector(new Vector3(0,2,0),new Vector3(2,0,0))).distanceTo(new Vector3(1,1,0).normalize())).toBeLessThan(1e-8); });
});
describe('materials.pbr', () => {
 it('Metalness for bare metal or paint over metal.', () => { expect(answered(finishMetalness("bare"))).toBe(1); expect(answered(finishMetalness("paint"))).toBe(0); });
});
describe('materials.light-types', () => {
 it('Point-source intensity at distance, inverse-square.', () => { expect(answered(pointIrradiance(400,4))).toBeCloseTo(answered(pointIrradiance(400,2))/4); });
});
describe('materials.environment-maps', () => {
 it('Set an environment light without changing the backdrop.', () => { const scene = new Scene(), backdrop = new Texture(), env = new Texture(); scene.background = backdrop; expect(answered(addEnvironment(scene,env))).toBe(scene); expect(scene.environment).toBe(env); expect(scene.background).toBe(backdrop); });
});
describe('materials.shadows', () => {
 it('Directional shadow-map texel density.', () => { expect(answered(shadowTexelsPerUnit(1024,8))).toBe(128); expect(answered(shadowTexelsPerUnit(1024,16))).toBe(64); });
});
describe('materials.baked-lighting', () => {
 it('Choose the second UV set for a baked AO map.', () => { const ao = new Texture(); expect(answered(useSecondUv(ao))).toBe(ao); expect(ao.channel).toBe(1); });
});
describe('materials.texture-sampling', () => {
 it('Set mipmapped minification for a distant tiling texture.', () => { const tex = new Texture(); expect(answered(mipFilter(tex))).toBe(tex); expect(tex.generateMipmaps).toBe(true); expect(tex.minFilter).toBe(LinearMipmapLinearFilter); });
});
describe('materials.channel-packing', () => {
 it('Read roughness and metalness from an ORM pixel.', () => { expect(answered(unpackOrm(new Vector3(.2,.4,.8)))).toEqual({roughness:.4,metalness:.8}); });
});
describe('materials.material-flags', () => {
 it('Set front-face rendering for a one-sided panel.', () => { const mat = new MeshBasicMaterial({side:DoubleSide}); expect(answered(oneSided(mat))).toBe(mat); expect(mat.side).toBe(FrontSide); });
});
