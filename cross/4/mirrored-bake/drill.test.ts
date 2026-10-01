import { answered } from '@harness/check';
import { BufferGeometry, DoubleSide, Float32BufferAttribute, Matrix4, Mesh, MeshBasicMaterial, Raycaster, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { bakeMirror } from './drill';

const triangle = (indexed: boolean) => {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position',new Float32BufferAttribute([0,0,0, 1,0,0, 0,1,0],3));
  geometry.setAttribute('uv',new Float32BufferAttribute([0,0, 1,0, 0,1],2));
  geometry.setAttribute('vertexTag',new Float32BufferAttribute([10,20,30],1));
  if(indexed) geometry.setIndex([0,1,2]);
  return geometry;
};
describe('mirrored baked geometry', () => {
  it.each([true,false])('keeps the front face raycastable, indexed=%s', (indexed) => {
    const original = triangle(indexed);
    const originalX = original.attributes.position.getX(1);
    const baked = answered(bakeMirror(original,new Matrix4().makeScale(-2,1,1)));
    const mesh = new Mesh(baked,new MeshBasicMaterial());
    mesh.updateMatrixWorld(true);
    const ray = new Raycaster(new Vector3(-0.4,0.2,2),new Vector3(0,0,-1));
    expect(ray.intersectObject(mesh).length).toBe(1);
    expect(original.attributes.position.getX(1)).toBe(originalX);
    expect(baked).not.toBe(original);
    expect(baked.attributes.uv.count).toBe(3);
    if (indexed) {
      expect(baked.index?.getX(1)).toBe(2);
      expect(baked.index?.getX(2)).toBe(1);
    } else {
      expect(baked.attributes.uv.getY(1)).toBe(1);
      expect(baked.attributes.uv.getX(2)).toBe(1);
      expect(baked.attributes.vertexTag.getX(1)).toBe(30);
      expect(baked.attributes.vertexTag.getX(2)).toBe(20);
    }
  });
});
