import { answered } from '@harness/check';
import { NoColorSpace, RepeatWrapping, SRGBColorSpace, Texture } from 'three';
import { describe, expect, it } from 'vitest';
import { setTextureSpaces } from './drill';

describe('setTextureSpaces', () => {
  it('marks only the color map as sRGB', () => {
    const albedo = new Texture(), normal = new Texture(), roughness = new Texture();
    const result = answered(setTextureSpaces(albedo, normal, roughness));
    expect(result.albedo).toBe(albedo);
    expect(result.normal).toBe(normal);
    expect(result.roughness).toBe(roughness);
    expect(albedo.colorSpace).toBe(SRGBColorSpace);
    expect(normal.colorSpace).toBe(NoColorSpace);
    expect(roughness.colorSpace).toBe(NoColorSpace);
  });

  it('does not change unrelated texture settings', () => {
    const albedo = new Texture(), normal = new Texture(), roughness = new Texture();
    albedo.wrapS = RepeatWrapping;
    normal.flipY = false;
    answered(setTextureSpaces(albedo, normal, roughness));
    expect(albedo.wrapS).toBe(RepeatWrapping);
    expect(normal.flipY).toBe(false);
  });
});
