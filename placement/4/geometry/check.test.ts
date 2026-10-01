import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import * as check from './check';

describe('geometry.object-types-tour', () => {
  it('makes the right judgment', () => {
    const g=new THREE.BoxGeometry(),m=new THREE.MeshBasicMaterial(); const o=answered(check.surfaceObject(g,m)); expect(o).toBeInstanceOf(THREE.Mesh); expect(o.geometry).toBe(g);
  });
});

describe('geometry.buffer-attribute', () => {
  it('makes the right judgment', () => {
    const a=new THREE.Float32BufferAttribute([1,2,3,4,5,6],3); expect(answered(check.vertexAt(a,1))).toEqual(new THREE.Vector3(4,5,6));
  });
});

describe('geometry.interleaved', () => {
  it('makes the right judgment', () => {
    const data=new THREE.InterleavedBuffer(new Float32Array([1,2,3,4,5]),5); const a=new THREE.InterleavedBufferAttribute(data,3,0); expect(answered(check.interleavedStride(a))).toBe(5);
  });
});

describe('geometry.indexed', () => {
  it('makes the right judgment', () => {
    const g=new THREE.BufferGeometry(); g.setIndex([2,1,0,0,1,2]); expect(answered(check.triangleIndices(g,1))).toEqual([0,1,2]);
  });
});

describe('geometry.winding-order', () => {
  it('makes the right judgment', () => {
    expect(answered(check.frontNormal(new THREE.Vector3(),new THREE.Vector3(1,0,0),new THREE.Vector3(0,1,0))).z).toBeCloseTo(1);
  });
});

describe('geometry.face-normals', () => {
  it('makes the right judgment', () => {
    const t=new THREE.Triangle(new THREE.Vector3(),new THREE.Vector3(2,0,0),new THREE.Vector3(0,2,0)); expect(answered(check.faceNormal(t))).toEqual(new THREE.Vector3(0,0,1));
  });
});

describe('geometry.vertex-normals', () => {
  it('makes the right judgment', () => {
    const g=new THREE.PlaneGeometry(); g.deleteAttribute('normal'); expect(answered(check.rebuildNormals(g)).count).toBe(g.getAttribute('position').count);
  });
});

describe('geometry.uvs', () => {
  it('makes the right judgment', () => {
    const g=new THREE.PlaneGeometry(); const uv=g.getAttribute('uv'); expect(answered(check.uvAt(g,2)).x).toBeCloseTo(uv.getX(2));
  });
});

describe('geometry.bounding-volumes', () => {
  it('makes the right judgment', () => {
    const g=new THREE.BoxGeometry(2,4,6); expect(answered(check.localBounds(g)).max.y).toBeCloseTo(2);
  });
});

describe('geometry.updating-buffers', () => {
  it('makes the right judgment', () => {
    const a=new THREE.Float32BufferAttribute([0,0,0],3); expect(answered(check.updateVertex(a,0,new THREE.Vector3(2,3,4)))).toBeGreaterThan(0); expect(a.getY(0)).toBe(3);
  });
});

describe('geometry.groups', () => {
  it('makes the right judgment', () => {
    const g=new THREE.BufferGeometry(); expect(answered(check.addMaterialGroup(g,0,6,1))).toBe(1); expect(g.groups.at(-1)?.materialIndex).toBe(1);
  });
});

describe('geometry.instanced-mesh', () => {
  it('makes the right judgment', () => {
    const m=new THREE.InstancedMesh(new THREE.BoxGeometry(),new THREE.MeshBasicMaterial(),2); expect(answered(check.setInstanceTransform(m,1,new THREE.Matrix4().makeTranslation(3,0,0)))).toBeGreaterThan(0);
  });
});

describe('geometry.tangent-space', () => {
  it('makes the right judgment', () => {
    expect(answered(check.bitangent(new THREE.Vector3(0,0,1),new THREE.Vector3(1,0,0)))).toEqual(new THREE.Vector3(0,1,0));
  });
});
