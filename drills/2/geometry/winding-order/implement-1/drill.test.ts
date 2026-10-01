import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { frontFacesViewer } from './drill';

describe('geometry.winding-order', () => {
  it('tell whether a triangle’s counter-clockwise front side faces a viewer along the given direction', () => {
    const a=new THREE.Vector3(0,0,0), b=new THREE.Vector3(2,0,0), c=new THREE.Vector3(0,1,0), view=new THREE.Vector3(0,0,1);
    expect(answered(frontFacesViewer(a,b,c,view))).toBe(true);
    expect(answered(frontFacesViewer(a,c,b,view))).toBe(false);
    expect(answered(frontFacesViewer(a,b,c,view.clone().negate()))).toBe(false);
  });
});
