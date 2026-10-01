import { answered } from '@harness/check';
import { BoxGeometry, MathUtils, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { labelState } from './drill';

describe('label projection and occlusion', () => {
  const camera = new PerspectiveCamera(60, 2, 0.1, 100);
  camera.position.set(0,0,5);
  camera.lookAt(0,0,0);
  it('keeps a label a fixed pixel height at depth', () => {
    const point = new Vector3(0,0,0);
    const result = answered(labelState(point,camera,800,400,24,[]));
    const expected = 2*5*Math.tan(MathUtils.degToRad(camera.fov)/2)*24/400;
    expect(result.x).toBeCloseTo(400);
    expect(result.y).toBeCloseTo(200);
    expect(result.worldHeight).toBeCloseTo(expected);
    expect(result.visible).toBe(true);
  });
  it('rejects a point behind the camera and one hidden by a mesh', () => {
    expect(answered(labelState(new Vector3(0,0,8),camera,800,400,24,[])).visible).toBe(false);
    const blocker = new Mesh(new BoxGeometry(1,1,1), new MeshBasicMaterial());
    blocker.position.z = 2;
    expect(answered(labelState(new Vector3(0,0,0),camera,800,400,24,[blocker])).visible).toBe(false);
  });
  it('uses the world eye position for a camera under a parent', () => {
    const parent = new Object3D();
    parent.position.z = 3;
    const nested = new PerspectiveCamera(60,2,0.1,100);
    nested.position.z = 2;
    parent.add(nested);
    const clear = answered(labelState(new Vector3(),nested,800,400,24,[]));
    expect(clear.visible).toBe(true);
    expect(clear.x).toBeCloseTo(400);
    expect(clear.y).toBeCloseTo(200);
    expect(clear.worldHeight).toBeCloseTo(2*5*Math.tan(MathUtils.degToRad(nested.fov)/2)*24/400);
    const blocker = new Mesh(new BoxGeometry(1,1,1), new MeshBasicMaterial());
    blocker.position.z = 4;
    expect(answered(labelState(new Vector3(),nested,800,400,24,[blocker])).visible).toBe(false);
  });
});
