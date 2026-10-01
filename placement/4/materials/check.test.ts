import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import * as check from './check';

describe('materials.materials-tour', () => {
  it('makes the right judgment', () => {
    expect(answered(check.materialForLight(true))).toBeInstanceOf(THREE.MeshStandardMaterial); expect(answered(check.materialForLight(false))).toBeInstanceOf(THREE.MeshBasicMaterial);
  });
});

describe('materials.lights-tour', () => {
  it('makes the right judgment', () => {
    const l=new THREE.DirectionalLight(); expect(answered(check.setLightStrength(l,2))).toBe(2);
  });
});

describe('materials.color-spaces', () => {
  it('makes the right judgment', () => {
    const t=new THREE.Texture(); expect(answered(check.markColorMap(t)).colorSpace).toBe(THREE.SRGBColorSpace);
  });
});

describe('materials.tone-mapping', () => {
  it('makes the right judgment', () => {
    expect(answered(check.exposureChoice(1,1))).toBe(2); expect(answered(check.exposureChoice(1,-1))).toBe(0.5);
  });
});

describe('materials.lambert', () => {
  it('makes the right judgment', () => {
    expect(answered(check.diffuseFactor(new THREE.Vector3(0,2,0),new THREE.Vector3(0,4,0)))).toBeCloseTo(1); expect(answered(check.diffuseFactor(new THREE.Vector3(0,1,0),new THREE.Vector3(0,-1,0)))).toBe(0);
  });
});

describe('materials.specular', () => {
  it('makes the right judgment', () => {
    const l=new THREE.Vector3(1,0,0),v=new THREE.Vector3(0,0,1); expect(answered(check.halfDirection(l,v)).length()).toBeCloseTo(1);
  });
});

describe('materials.pbr', () => {
  it('makes the right judgment', () => {
    const scene=new THREE.Scene(), metal=new THREE.MeshStandardMaterial({metalness:1});
    expect(answered(check.metalNeedsEnvironment(metal,scene))).toBe(true);
    metal.envMap=new THREE.Texture();
    expect(answered(check.metalNeedsEnvironment(metal,scene))).toBe(false);
    metal.envMap=null; scene.environment=new THREE.Texture();
    expect(answered(check.metalNeedsEnvironment(metal,scene))).toBe(false);
  });
});

describe('materials.light-types', () => {
  it('makes the right judgment', () => {
    expect(answered(check.shadowCapable(new THREE.DirectionalLight()))).toBe(true); expect(answered(check.shadowCapable(new THREE.HemisphereLight()))).toBe(false);
  });
});

describe('materials.environment-maps', () => {
  it('makes the right judgment', () => {
    const s=new THREE.Scene(),t=new THREE.Texture(); answered(check.applyEnvironment(s,t)); expect(s.environment).toBe(t); expect(s.background).toBeNull();
  });
});

describe('materials.shadows', () => {
  it('makes the right judgment', () => {
    const l=new THREE.DirectionalLight(); expect(answered(check.castShadow(l))).toBe(true);
  });
});

describe('materials.baked-lighting', () => {
  it('makes the right judgment', () => {
    const m=new THREE.MeshStandardMaterial(),t=new THREE.Texture(); answered(check.attachLightMap(m,t)); expect(m.lightMap).toBe(t);
  });
});

describe('materials.texture-sampling', () => {
  it('makes the right judgment', () => {
    const t=new THREE.Texture(); expect(answered(check.useMipFiltering(t)).minFilter).toBe(THREE.LinearMipmapLinearFilter);
  });
});

describe('materials.channel-packing', () => {
  it('makes the right judgment', () => {
    expect(answered(check.roughnessByte([10,130,240,255]))).toBe(130);
  });
});

describe('materials.material-flags', () => {
  it('makes the right judgment', () => {
    const m=new THREE.MeshBasicMaterial(); expect(answered(check.makeCutout(m,0.5))).toBe(0.5); expect(m.version).toBeGreaterThan(0);
  });
});
