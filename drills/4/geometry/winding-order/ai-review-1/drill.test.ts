import { BufferGeometry, Float32BufferAttribute, Matrix4, Triangle, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { bakeTransform } from './drill';
describe('bakeTransform', () => {
  it('keeps transformed normals aligned with front winding after a mirror', () => {
    const original = new BufferGeometry();
    original.setAttribute('position', new Float32BufferAttribute([0, 0, 0, 2, 0, 0, 0, 1, 1, 2, 1, 1], 3));
    original.setAttribute('uv', new Float32BufferAttribute([0, 0, 1, 0, 0, 1, 1, 1], 2));
    original.setIndex([0, 1, 2, 2, 1, 3]); original.computeVertexNormals();
    const originalPositions = Array.from(original.getAttribute('position').array);
    const originalUv = Array.from(original.getAttribute('uv').array);
    for (const scale of [new Vector3(1, 2, 1), new Vector3(-1, 2, 1)]) {
      const result = bakeTransform(original, new Matrix4().makeScale(scale.x, scale.y, scale.z));
      const pos = result.getAttribute('position'); const index = result.index!;
      const point = (i: number) => new Vector3().fromBufferAttribute(pos, index.getX(i));
      for (const offset of [0, 3]) {
        const face = Triangle.getNormal(point(offset), point(offset + 1), point(offset + 2), new Vector3());
        const normal = new Vector3().fromBufferAttribute(result.getAttribute('normal'), index.getX(offset));
        expect(face.dot(normal)).toBeGreaterThan(0.99);
      }
      expect(Array.from(result.getAttribute('uv').array)).toEqual(originalUv);
      expect(result).not.toBe(original);
    }
    expect(original.index?.array).toEqual(new Uint16Array([0, 1, 2, 2, 1, 3]));
    expect(Array.from(original.getAttribute('position').array)).toEqual(originalPositions);
  });
});
