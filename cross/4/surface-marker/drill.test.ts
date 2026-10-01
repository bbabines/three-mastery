import { answered, expectUnchanged, expectVector } from '@harness/check';
import { Object3D, Triangle, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { markerNormal } from './drill';

describe('surface marker normal', () => {
  it('stays perpendicular to a sloped face after uneven scale', () => {
    const parent = new Object3D();
    parent.scale.set(3, 1, 0.5);
    parent.rotation.y = 0.43;
    const mesh = new Object3D();
    mesh.rotation.z = 0.31;
    parent.add(mesh);
    const a = new Vector3(0, 0, 0), b = new Vector3(1, 0, 1), c = new Vector3(0, 1, 0.4);
    const local = new Triangle(a, b, c).getNormal(new Vector3());
    const answer = answered(markerNormal(local, mesh));
    mesh.updateWorldMatrix(true, false);
    const aw = a.clone().applyMatrix4(mesh.matrixWorld);
    const edge1 = b.clone().applyMatrix4(mesh.matrixWorld).sub(aw);
    const edge2 = c.clone().applyMatrix4(mesh.matrixWorld).sub(aw);
    expect(Math.abs(answer.dot(edge1))).toBeLessThan(1e-6);
    expect(Math.abs(answer.dot(edge2))).toBeLessThan(1e-6);
    expect(answer.length()).toBeCloseTo(1);
    expectUnchanged(local, new Triangle(a, b, c).getNormal(new Vector3()), 'local normal');
  });
  it('agrees on a rigidly turned face too', () => {
    const mesh = new Object3D();
    mesh.rotation.x = 0.8;
    expectVector(markerNormal(new Vector3(0, 1, 0), mesh), new Vector3(0, 1, 0).applyEuler(mesh.rotation));
  });
});
