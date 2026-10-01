import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import * as check from './check';

describe('debugging.triage', () => {
  it('makes the right judgment', () => {
    expect(answered(check.firstBucket(true,false,true))).toBe('material'); expect(answered(check.firstBucket(true,true,false))).toBe('camera');
  });
});

describe('debugging.nothing-renders', () => {
  it('makes the right judgment', () => {
    const c=new THREE.PerspectiveCamera(); c.position.z=5; expect(answered(check.cameraSeesPoint(c,new THREE.Vector3()))).toBe(true);
  });
});

describe('debugging.helpers', () => {
  it('makes the right judgment', () => {
    const a=answered(check.axesAt(new THREE.Vector3(2,3,4),2)); expect(a.position.x).toBe(2);
  });
});

describe('debugging.visualizing-vectors', () => {
  it('makes the right judgment', () => {
    const a=answered(check.directionArrow(new THREE.Vector3(1,0,0),new THREE.Vector3(0,2,0))); expect(a.position.x).toBe(1);
  });
});

describe('debugging.reading-matrices', () => {
  it('makes the right judgment', () => {
    expect(answered(check.translationFromMatrix(new THREE.Matrix4().makeTranslation(2,3,4)))).toEqual(new THREE.Vector3(2,3,4));
  });
});

describe('debugging.nan-degenerate', () => {
  it('makes the right judgment', () => {
    expect(answered(check.finitePoint(new THREE.Vector3(1,2,3)))).toBe(true); expect(answered(check.finitePoint(new THREE.Vector3(NaN,2,3)))).toBe(false);
  });
});

describe('debugging.isolation', () => {
  it('makes the right judgment', () => {
    const old=new THREE.MeshStandardMaterial(), m=new THREE.Mesh(undefined,old); expect(answered(check.simpleMaterial(m))).toBe(old); expect(m.material).toBeInstanceOf(THREE.MeshBasicMaterial);
  });
});

describe('debugging.frame-capture', () => {
  it('makes the right judgment', () => {
    expect(answered(check.frameNeedsCapture(30,10))).toBe(true); expect(answered(check.frameNeedsCapture(8,10))).toBe(false);
  });
});

describe('debugging.shader-errors', () => {
  it('makes the right judgment', () => {
    expect(answered(check.shaderFailed('ERROR: 0:12: undeclared identifier'))).toBe(true); expect(answered(check.shaderFailed('compile successful'))).toBe(false);
  });
});

describe('debugging.debug-views', () => {
  it('makes the right judgment', () => {
    const old=new THREE.MeshStandardMaterial(),m=new THREE.Mesh(undefined,old); expect(answered(check.normalView(m))).toBe(old); expect(m.material).toBeInstanceOf(THREE.MeshNormalMaterial);
  });
});
