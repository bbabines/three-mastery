import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { checkObjectTypesTour, checkBufferAttribute, checkInterleaved, checkIndexed, checkWindingOrder, checkFaceNormals, checkVertexNormals, checkUvs, checkBoundingVolumes, checkUpdatingBuffers, checkGroups, checkInstancedMesh, checkTangentSpace } from './check';

describe('geometry.object-types-tour', () => {
  it('checks object types tour', () => {
    const geometry=new THREE.BoxGeometry(), material=new THREE.MeshBasicMaterial(); const mesh=answered(checkObjectTypesTour(geometry,material,5));
    expect(mesh.count).toBe(5); expect(mesh.geometry).toBe(geometry); expect(mesh.material).toBe(material);
    const matrix=new THREE.Matrix4(); mesh.getMatrixAt(4,matrix); expect(new THREE.Vector3().setFromMatrixPosition(matrix).x).toBe(4);
  });
});

describe('geometry.buffer-attribute', () => {
  it('checks buffer attribute', () => {
    const attr=new THREE.BufferAttribute(new Float32Array([1,2,3,4,5,6,7,8,9]),3);
    expect(answered(checkBufferAttribute(attr,2)).distanceTo(new THREE.Vector3(7,8,9))).toBeLessThan(1e-6);
    expect(answered(checkBufferAttribute(attr,1)).distanceTo(new THREE.Vector3(4,5,6))).toBeLessThan(1e-6);
  });
});

describe('geometry.interleaved', () => {
  it('checks interleaved', () => {
    const data=new THREE.InterleavedBuffer(new Float32Array([0,0,0, 0.2,0.3, 1,1,1, 0.4,0.5]),5);
    const position=new THREE.InterleavedBufferAttribute(data,3,0); const uv=new THREE.InterleavedBufferAttribute(data,2,3);
    const before=data.version; expect(answered(checkInterleaved(position,1,new THREE.Vector3(2,3,4)))).toBe(true);
    expect(new THREE.Vector3(position.getX(1),position.getY(1),position.getZ(1)).distanceTo(new THREE.Vector3(2,3,4))).toBeLessThan(1e-6);
    expect(uv.getX(1)).toBeCloseTo(0.4); expect(data.version).toBeGreaterThan(before);
  });
});

describe('geometry.indexed', () => {
  it('checks indexed', () => {
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0, 2,0,0, 2,2,0, 0,2,0],3)); g.setIndex([0,1,2,0,2,3]);
    const [a,b,c]=answered(checkIndexed(g,1));
    expect(a.distanceTo(new THREE.Vector3(0,0,0))).toBeLessThan(1e-6);
    expect(b.distanceTo(new THREE.Vector3(2,2,0))).toBeLessThan(1e-6);
    expect(c.distanceTo(new THREE.Vector3(0,2,0))).toBeLessThan(1e-6);
  });
});

describe('geometry.winding-order', () => {
  it('checks winding order', () => {
    const a=new THREE.Vector3(0,0,0), b=new THREE.Vector3(2,0,0), c=new THREE.Vector3(0,1,0), view=new THREE.Vector3(0,0,1);
    expect(answered(checkWindingOrder(a,b,c,view))).toBe(true);
    expect(answered(checkWindingOrder(a,c,b,view))).toBe(false);
    expect(answered(checkWindingOrder(a,b,c,view.clone().negate()))).toBe(false);
  });
});

describe('geometry.face-normals', () => {
  it('checks face normals', () => {
    const a=new THREE.Vector3(0,0,0), b=new THREE.Vector3(2,0,1), c=new THREE.Vector3(0,1,2);
    const matrix=new THREE.Matrix4().compose(new THREE.Vector3(3,0,0),new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),0.4),new THREE.Vector3(3,1,0.5));
    const n=answered(checkFaceNormals(a,b,c,matrix));
    const aw=a.clone().applyMatrix4(matrix), bw=b.clone().applyMatrix4(matrix), cw=c.clone().applyMatrix4(matrix);
    expect(n.angleTo(THREE.Triangle.getNormal(aw,bw,cw,new THREE.Vector3()))).toBeLessThan(1e-6);
  });
});

describe('geometry.vertex-normals', () => {
  it('checks vertex normals', () => {
    const g=new THREE.SphereGeometry(1,8,4); g.deleteAttribute('normal'); const copy=answered(checkVertexNormals(g));
    expect(copy.getAttribute('normal')).toBeDefined(); expect(g.getAttribute('normal')).toBeUndefined();
    const n=new THREE.Vector3().fromBufferAttribute(copy.getAttribute('normal'),3); expect(n.length()).toBeCloseTo(1,4);
  });
});

describe('geometry.uvs', () => {
  it('checks uvs', () => {
    const g = new THREE.PlaneGeometry();
    const source = g.getAttribute('uv');
    const sourceValues = Array.from({ length: g.index!.count }, (_, i) => {
      const vertex = g.index!.getX(i);
      return new THREE.Vector2(source.getX(vertex), source.getY(vertex));
    });
    const offset = new THREE.Vector2(1, 0.5);
    const shifted = answered(checkUvs(g, offset));
    const output = shifted.getAttribute('uv');
    expect(shifted.index).toBeNull();
    for (let i = 0; i < sourceValues.length; i++) {
      const expected = sourceValues[i].clone().add(i < 3 ? offset : new THREE.Vector2());
      expect(new THREE.Vector2(output.getX(i), output.getY(i)).distanceTo(expected)).toBeLessThan(1e-6);
    }
    expect(g.index!.count).toBe(6);
    expect(source.getX(g.index!.getX(0))).toBe(sourceValues[0].x);
  });
});

describe('geometry.bounding-volumes', () => {
  it('checks bounding volumes', () => {
    const g=new THREE.BoxGeometry(1,1,1); g.computeBoundingSphere(); const old=g.boundingSphere!.radius;
    const p=g.getAttribute('position'); p.setXYZ(0,20,0,0);
    const sphere=answered(checkBoundingVolumes(g));
    expect(sphere.radius).toBeGreaterThan(old); expect(sphere.containsPoint(new THREE.Vector3(20,0,0))).toBe(true);
  });
});

describe('geometry.updating-buffers', () => {
  it('checks updating buffers', () => {
    const a=new THREE.BufferAttribute(new Float32Array(6),3); const before=a.version; expect(answered(checkUpdatingBuffers(a,1,new THREE.Vector3(1,2,3)))).toBeGreaterThan(before); expect(new THREE.Vector3().fromBufferAttribute(a,1).distanceTo(new THREE.Vector3(1,2,3))).toBeLessThan(1e-6);
  });
});

describe('geometry.groups', () => {
  it('checks groups', () => {
    const g=new THREE.BoxGeometry(); expect(answered(checkGroups(g,0,3,1))).toBe(g.groups.length); expect(g.groups.at(-1)).toEqual({start:0,count:3,materialIndex:1});
  });
});

describe('geometry.instanced-mesh', () => {
  it('checks instanced mesh', () => {
    const mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(),new THREE.MeshBasicMaterial(),3); expect(answered(checkInstancedMesh(mesh,2,new THREE.Vector3(4,1,0)))).toBe(true); const m=new THREE.Matrix4(); mesh.getMatrixAt(2,m); expect(new THREE.Vector3().setFromMatrixPosition(m).distanceTo(new THREE.Vector3(4,1,0))).toBeLessThan(1e-6);
  });
});

describe('geometry.tangent-space', () => {
  it('checks tangent space', () => {
    const tangent=new THREE.Vector3(1,0,0), bitangent=new THREE.Vector3(0,1,0), normal=new THREE.Vector3(0,0,1);
    expect(answered(checkTangentSpace(new THREE.Vector3(0.5,0.5,1),tangent,bitangent,normal)).distanceTo(normal)).toBeLessThan(1e-6);
    const sample=new THREE.Vector3(0.8,0.2,0.9); const expected=new THREE.Vector3(0.6,-0.6,0.8).normalize();
    expect(answered(checkTangentSpace(sample,tangent,bitangent,normal)).distanceTo(expected)).toBeLessThan(1e-6);
  });
});
