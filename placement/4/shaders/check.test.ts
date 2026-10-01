import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import * as check from './check';

describe('shaders.vertex-vs-fragment', () => {
  it('makes the right judgment', () => {
    expect(answered(check.stageForPixelColor(true))).toBe('fragment');
  });
});

describe('shaders.attributes-uniforms-varyings', () => {
  it('makes the right judgment', () => {
    const m=new THREE.ShaderMaterial(); expect(answered(check.setUniform(m,'time',2))).toBe(2);
  });
});

describe('shaders.built-in-matrices', () => {
  it('makes the right judgment', () => {
    expect(answered(check.worldPointFromModel(new THREE.Vector3(1,0,0),new THREE.Matrix4().makeTranslation(3,0,0))).x).toBe(4);
  });
});

describe('shaders.swizzling', () => {
  it('makes the right judgment', () => {
    expect(answered(check.blueRedGreen(new THREE.Vector3(1,2,3)))).toEqual(new THREE.Vector3(3,1,2));
  });
});

describe('shaders.built-in-functions', () => {
  it('makes the right judgment', () => {
    expect(answered(check.clampedLighting(new THREE.Vector3(0,1,0),new THREE.Vector3(0,-2,0)))).toBe(0);
  });
});

describe('shaders.types-precision', () => {
  it('makes the right judgment', () => {
    expect(answered(check.precisionForWorldPosition(true))).toBe('highp');
  });
});

describe('shaders.extending-materials', () => {
  it('makes the right judgment', () => {
    const m=new THREE.MeshStandardMaterial(); expect(answered(check.markShaderChange(m))).toBeGreaterThan(0);
  });
});

describe('shaders.derivatives', () => {
  it('makes the right judgment', () => {
    expect(answered(check.edgeWidth(-0.2,0.3))).toBeCloseTo(0.5);
  });
});

describe('shaders.fragment-coordinates', () => {
  it('makes the right judgment', () => {
    expect(answered(check.fragmentUv(200,100,400,200))).toEqual(new THREE.Vector2(0.5,0.5));
  });
});

describe('shaders.branching-discard', () => {
  it('makes the right judgment', () => {
    expect(answered(check.keepFragment(0.4,0.5))).toBe(false); expect(answered(check.keepFragment(0.6,0.5))).toBe(true);
  });
});

describe('shaders.debug-output', () => {
  it('makes the right judgment', () => {
    const c=answered(check.normalDebugColor(new THREE.Vector3(0,0,1))); expect(c.r).toBeCloseTo(0.5); expect(c.b).toBeCloseTo(1);
  });
});
