import { answered } from '@harness/check';
import { BoxGeometry, Mesh, MeshBasicMaterial, Object3D, Raycaster, Vector3 } from 'three';
import { describe, expect, it, vi } from 'vitest';
import { measureRaycasts } from './drill';

describe('raycast workload measurement', () => {
  it('measures a recursive tree and a direct dense object', () => {
    const hierarchy = new Object3D();
    const child = new Object3D();
    child.add(new Mesh(new BoxGeometry(1,1,1), new MeshBasicMaterial()));
    hierarchy.add(child);
    const dense = new Mesh(new BoxGeometry(1,1,1,8,8,8), new MeshBasicMaterial());
    hierarchy.updateMatrixWorld(true);
    dense.updateMatrixWorld(true);
    const ray = new Raycaster(new Vector3(0,0,4), new Vector3(0,0,-1));
    const expectedHierarchyHits = ray.intersectObject(hierarchy, true).length * 3;
    const expectedDenseHits = ray.intersectObject(dense, false).length * 3;
    const spy = vi.spyOn(ray, 'intersectObject');
    const result = answered(measureRaycasts(ray,hierarchy,dense,3));
    expect(spy).toHaveBeenCalledTimes(6);
    expect(spy).toHaveBeenNthCalledWith(1,hierarchy,true);
    expect(spy).toHaveBeenNthCalledWith(4,dense,false);
    expect(result.hierarchyHits).toBe(expectedHierarchyHits);
    expect(result.denseHits).toBe(expectedDenseHits);
    expect(Number.isFinite(result.hierarchyMs) && result.hierarchyMs >= 0).toBe(true);
    expect(Number.isFinite(result.denseMs) && result.denseMs >= 0).toBe(true);
  });
});
