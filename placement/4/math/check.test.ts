import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import * as check from './check';

describe('math.point-vs-direction', () => {
  it('makes the right judgment', () => {
    const p=new THREE.Vector3(2,3,4); expect(answered(check.translatePoint(p,new THREE.Vector3(-1,2,0)))).toEqual(new THREE.Vector3(1,5,4)); expect(p.x).toBe(2);
  });
});

describe('math.length', () => {
  it('makes the right judgment', () => {
    expect(answered(check.withinRadius(new THREE.Vector3(),new THREE.Vector3(3,4,0),5))).toBe(true); expect(answered(check.withinRadius(new THREE.Vector3(),new THREE.Vector3(3,4,0),4))).toBe(false);
  });
});

describe('math.normalize', () => {
  it('makes the right judgment', () => {
    expect(answered(check.safeHeading(new THREE.Vector3(1,0,0),new THREE.Vector3(1,0,4)))).toEqual(new THREE.Vector3(0,0,1));
  });
});

describe('math.dot-product', () => {
  it('makes the right judgment', () => {
    expect(answered(check.movingToward(new THREE.Vector3(2,0,1),new THREE.Vector3(3,0,0)))).toBe(true); expect(answered(check.movingToward(new THREE.Vector3(-2,0,1),new THREE.Vector3(3,0,0)))).toBe(false);
  });
});

describe('math.cross-product', () => {
  it('makes the right judgment', () => {
    expect(answered(check.triangleDirection(new THREE.Vector3(),new THREE.Vector3(2,0,0),new THREE.Vector3(0,3,0)))).toEqual(new THREE.Vector3(0,0,1));
  });
});

describe('math.projection-rejection', () => {
  it('makes the right judgment', () => {
    const v=new THREE.Vector3(3,2,1), axis=new THREE.Vector3(2,2,0); expect(answered(check.allowedMotion(v,axis))).toEqual(v.clone().projectOnVector(axis)); expect(v.x).toBe(3);
  });
});

describe('math.reflection', () => {
  it('makes the right judgment', () => {
    expect(answered(check.reflectedMotion(new THREE.Vector3(1,-2,0),new THREE.Vector3(0,3,0)))).toEqual(new THREE.Vector3(1,2,0));
  });
});

describe('math.lerp', () => {
  it('makes the right judgment', () => {
    expect(answered(check.clampedBlend(new THREE.Vector3(),new THREE.Vector3(10,0,0),0.3)).x).toBeCloseTo(3); expect(answered(check.clampedBlend(new THREE.Vector3(),new THREE.Vector3(10,0,0),2)).x).toBe(10);
  });
});

describe('math.angle-between', () => {
  it('makes the right judgment', () => {
    expect(answered(check.signedYaw(new THREE.Vector3(0,0,1),new THREE.Vector3(1,0,0)))).toBeCloseTo(Math.PI/2);
  });
});

describe('math.spherical-coords', () => {
  it('makes the right judgment', () => {
    expect(answered(check.orbitOffset(3,Math.PI/2,0)).z).toBeCloseTo(3);
  });
});

describe('math.triple-product', () => {
  it('makes the right judgment', () => {
    expect(answered(check.isLeftHanded(new THREE.Vector3(1,0,0),new THREE.Vector3(0,1,0),new THREE.Vector3(0,0,-1)))).toBe(true);
  });
});

describe('math.float-tolerance', () => {
  it('makes the right judgment', () => {
    expect(answered(check.sameSpot(new THREE.Vector3(1,0,0),new THREE.Vector3(1+1e-7,0,0),1e-6))).toBe(true);
  });
});
