import { answered, expectUnchanged, expectVector } from '@harness/check';
import { Box3, BoxGeometry, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, Sphere, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { focusStep } from './drill';

describe('damped clicked-part focus', () => {
  const makePart = (size: number) => {
    const parent = new Object3D();
    parent.position.set(4,1,-2);
    parent.rotation.y = 0.35;
    const child = new Mesh(new BoxGeometry(size,1,1),new MeshBasicMaterial());
    child.position.set(0.8, 0.5, -0.3);
    parent.add(child);
    return parent;
  };
  it('moves toward the nested world bounds without changing its target', () => {
    const camera = new PerspectiveCamera(50,1,0.1,100);
    camera.position.set(0,2,8);
    const current = new Vector3();
    const part = makePart(2);
    const result = answered(focusStep(camera,current,part,0.4));
    const center = new Box3().setFromObject(part, true).getBoundingSphere(new Sphere()).center;
    expect(result.target.length()).toBeGreaterThan(0);
    expect(result.target.length()).toBeLessThan(center.length());
    expect(result.target.clone().normalize().distanceTo(center.normalize())).toBeLessThan(1e-6);
    expectUnchanged(current,new Vector3(),'target');
    expectVector(camera.position,new Vector3(0,2,8));
  });
  it('two half steps land at one full step and a wider part fits farther away', () => {
    const camera = new PerspectiveCamera(50,0.7,0.1,100);
    camera.position.set(0,2,8);
    const part = makePart(2);
    const once = answered(focusStep(camera,new Vector3(),part,0.4));
    const half = answered(focusStep(camera,new Vector3(),part,0.2));
    camera.position.copy(half.position);
    const twice = answered(focusStep(camera,half.target,part,0.2));
    expectVector(twice.position,once.position);
    expectVector(twice.target,once.target);
    const wide = answered(focusStep(camera,half.target,makePart(8),1));
    expect(wide.position.distanceTo(wide.target)).toBeGreaterThan(twice.position.distanceTo(twice.target));
  });
});
