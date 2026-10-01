import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { segmentSnap } from './drill';

describe('queries.closest-point', () => {
  it('repairs the reported symptom for a general case', () => {
    const a=new THREE.Vector3(1,1,0), b=new THREE.Vector3(3,3,0), point=new THREE.Vector3(6,5,0);
    const before=[point.clone(),a.clone(),b.clone()];
    const edge=new THREE.Line3(a,b);
    expect(segmentSnap(point,a,b).distanceTo(edge.closestPointToPoint(point,true,new THREE.Vector3()))).toBeLessThan(1e-6);
    const pastStart=new THREE.Vector3(-2,0,0);
    expect(segmentSnap(pastStart,a,b).distanceTo(edge.closestPointToPoint(pastStart,true,new THREE.Vector3()))).toBeLessThan(1e-6);
    const middle=new THREE.Vector3(2,3,0);
    expect(segmentSnap(middle,a,b).distanceTo(edge.closestPointToPoint(middle,true,new THREE.Vector3()))).toBeLessThan(1e-6);
    expect(point.equals(before[0])&&a.equals(before[1])&&b.equals(before[2])).toBe(true);
  });
});
