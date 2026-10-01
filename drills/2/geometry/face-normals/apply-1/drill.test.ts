import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { flatFaceToward } from './drill';

describe('geometry.face-normals', () => {
  it('use a triangle’s geometric face normal to tell whether its front faces a world-space view direction', () => {
    const a=new THREE.Vector3(0,0,0), b=new THREE.Vector3(1,0,0), c=new THREE.Vector3(0,1,1);
    const n=THREE.Triangle.getNormal(a,b,c,new THREE.Vector3());
    expect(answered(flatFaceToward(a,b,c,n))).toBe(true);
    expect(answered(flatFaceToward(a,b,c,n.clone().negate()))).toBe(false);
  });
});
