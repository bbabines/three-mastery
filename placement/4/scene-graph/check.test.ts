import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import * as check from './check';

describe('scene-graph.traverse', () => {
  it('makes the right judgment', () => {
    const r=new THREE.Group(),g=new THREE.Group(); g.add(new THREE.Mesh()); r.add(g); expect(answered(check.meshCount(r))).toBe(1);
  });
});

describe('scene-graph.finding-objects', () => {
  it('makes the right judgment', () => {
    const r=new THREE.Group(), c=new THREE.Mesh(); c.name='part'; r.add(c); expect(answered(check.findNamed(r,'part'))).toBe(c);
  });
});

describe('scene-graph.safe-mutation', () => {
  it('makes the right judgment', () => {
    const r=new THREE.Group(); for(let i=0;i<3;i++){const m=new THREE.Mesh();m.name='helper';r.add(m);} expect(answered(check.removeNamed(r,'helper'))).toBe(3); expect(r.children.length).toBe(0);
  });
});

describe('scene-graph.world-bounds', () => {
  it('makes the right judgment', () => {
    const r=new THREE.Group(); r.position.x=4; r.add(new THREE.Mesh(new THREE.BoxGeometry(2,2,2))); expect(answered(check.worldBox(r)).max.x).toBeCloseTo(5);
  });
});

describe('scene-graph.scene-stats', () => {
  it('makes the right judgment', () => {
    const r=new THREE.Group(); r.add(new THREE.Mesh(new THREE.PlaneGeometry())); expect(answered(check.triangleCount(r))).toBe(2);
  });
});

describe('scene-graph.visibility-layers', () => {
  it('makes the right judgment', () => {
    const o=new THREE.Object3D(); expect(answered(check.makePickLayer(o,2))).toBe(4);
  });
});

describe('scene-graph.user-data', () => {
  it('makes the right judgment', () => {
    const o=new THREE.Object3D(); expect(answered(check.tagPart(o,'left-bracket'))).toBe('left-bracket'); expect(o.userData.partId).toBe('left-bracket');
  });
});

describe('scene-graph.material-override', () => {
  it('makes the right judgment', () => {
    const old=new THREE.MeshBasicMaterial(), next=new THREE.MeshBasicMaterial(), m=new THREE.Mesh(undefined,old); expect(answered(check.overrideMaterial(m,next))).toBe(old); expect(m.material).toBe(next);
  });
});

describe('scene-graph.clone-semantics', () => {
  it('makes the right judgment', () => {
    const r=new THREE.Group(), m=new THREE.Mesh(new THREE.BoxGeometry()); r.add(m); const copy=answered(check.duplicateTree(r)); expect(copy).not.toBe(r); expect((copy.children[0] as THREE.Mesh).geometry).toBe(m.geometry);
  });
});
