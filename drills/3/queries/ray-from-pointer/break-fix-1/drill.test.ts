import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { pointerRay } from './drill';

describe('queries.ray-from-pointer', () => {
  it('repairs the reported symptom for a general case', () => {
    const camera=new THREE.PerspectiveCamera(60,1.5,0.1,100); camera.position.z=5; camera.updateMatrixWorld(); const rect={left:200,top:100,width:600,height:400};
    const got=pointerRay(camera,650,200,rect), caster=new THREE.Raycaster(); caster.setFromCamera(new THREE.Vector2(0.5,0.5),camera);
    expect(got.direction.angleTo(caster.ray.direction)).toBeLessThan(1e-6);
    expect(got.origin.distanceTo(caster.ray.origin)).toBeLessThan(1e-6);
    const corner=pointerRay(camera,200,100,rect); caster.setFromCamera(new THREE.Vector2(-1,1),camera);
    expect(corner.direction.angleTo(caster.ray.direction)).toBeLessThan(1e-6);
  });
});
