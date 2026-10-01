import { answered } from '@harness/check';
import { EquirectangularReflectionMapping, MeshStandardMaterial, Scene, Texture } from 'three';
import { describe, expect, it } from 'vitest';
import { prepareChrome } from './drill';

describe('mobile chrome environment', () => {
  it.each([true,false])('uses a supported environment, preferred=%s', (supported) => {
    const scene = new Scene();
    const material = new MeshStandardMaterial({metalness:0});
    const preferred = new Texture(), fallback = new Texture();
    const choice = answered(prepareChrome(scene,material,preferred,fallback,supported));
    expect(choice).toBe(supported ? 'preferred' : 'fallback');
    expect(scene.environment).toBe(supported ? preferred : fallback);
    expect(scene.environment?.mapping).toBe(EquirectangularReflectionMapping);
    expect(material.metalness).toBe(1);
  });
});
