import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import * as check from './check';

describe('queries.ray', () => {
  it('makes the right judgment', () => {
    const ray=new THREE.Ray(new THREE.Vector3(1,2,3),new THREE.Vector3(0,0,-1)); expect(answered(check.pointAlongRay(ray,2))).toEqual(new THREE.Vector3(1,2,1));
  });
});

describe('queries.ray-from-pointer', () => {
  it('makes the right judgment', () => {
    const c=new THREE.PerspectiveCamera(); c.position.z=5; const ray=answered(check.pointerRay(c,new THREE.Vector2())); expect(ray.direction.z).toBeCloseTo(-1);
  });
});

describe('queries.intersection-anatomy', () => {
  it('makes the right judgment', () => {
    const p=new THREE.Vector3(1,2,3), h={point:p} as THREE.Intersection; expect(answered(check.hitPoint(h))).toEqual(p); expect(answered(check.hitPoint(h))).not.toBe(p);
  });
});

describe('queries.filtering', () => {
  it('makes the right judgment', () => {
    const m=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshBasicMaterial()), g=new THREE.Group(); g.add(m); g.updateMatrixWorld(true); const r=new THREE.Raycaster(new THREE.Vector3(0,0,3),new THREE.Vector3(0,0,-1)); expect(answered(check.selectableHits(r,[g])).length).toBeGreaterThan(0);
  });
});

describe('queries.ray-plane', () => {
  it('makes the right judgment', () => {
    const r=new THREE.Ray(new THREE.Vector3(0,2,0),new THREE.Vector3(0,-1,0)); expect(answered(check.floorPoint(r,0))).toEqual(new THREE.Vector3());
  });
});

describe('queries.ray-sphere', () => {
  it('makes the right judgment', () => {
    const r=new THREE.Ray(new THREE.Vector3(0,0,3),new THREE.Vector3(0,0,-1)); expect(answered(check.spherePoint(r,new THREE.Sphere(new THREE.Vector3(),1)))?.z).toBeCloseTo(1);
  });
});

describe('queries.ray-triangle', () => {
  it('makes the right judgment', () => {
    const r=new THREE.Ray(new THREE.Vector3(0.2,0.2,2),new THREE.Vector3(0,0,-1)); expect(answered(check.trianglePoint(r,new THREE.Vector3(),new THREE.Vector3(1,0,0),new THREE.Vector3(0,1,0)))?.z).toBeCloseTo(0);
  });
});

describe('queries.ray-aabb', () => {
  it('makes the right judgment', () => {
    const r=new THREE.Ray(new THREE.Vector3(0,0,3),new THREE.Vector3(0,0,-1)); expect(answered(check.boxPoint(r,new THREE.Box3(new THREE.Vector3(-1,-1,-1),new THREE.Vector3(1,1,1))))?.z).toBeCloseTo(1);
  });
});

describe('queries.bounds-primitives', () => {
  it('makes the right judgment', () => {
    const o=new THREE.Mesh(new THREE.BoxGeometry(2,2,2)); o.position.x=3; expect(answered(check.objectSphere(o)).center.x).toBeCloseTo(3);
  });
});

describe('queries.aabb-vs-obb', () => {
  it('makes the right judgment', () => {
    const o=new THREE.Mesh(new THREE.BoxGeometry(2,1,1)); o.rotation.y=0.7; const b=answered(check.worldAabb(o)); expect(b.max.x).toBeGreaterThan(1);
  });
});

describe('queries.closest-point', () => {
  it('makes the right judgment', () => {
    const l=new THREE.Line3(new THREE.Vector3(),new THREE.Vector3(2,0,0)); expect(answered(check.nearestOnSegment(l,new THREE.Vector3(3,2,0)))).toEqual(new THREE.Vector3(2,0,0));
  });
});

describe('queries.bvh', () => {
  it('makes the right judgment', () => {
    const a={distance:4} as THREE.Intersection,b={distance:1} as THREE.Intersection; expect(answered(check.nearestAcceleratedHit([a,b]))).toBe(b);
  });
});
