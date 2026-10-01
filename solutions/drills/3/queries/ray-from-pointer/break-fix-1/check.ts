import * as THREE from 'three';
import { expect } from 'vitest';
import type { pointerRay } from './drill';

export function checkRayFromPointer(subject: typeof pointerRay): void {
  const camera=new THREE.PerspectiveCamera(65,1.5,0.1,100); camera.position.set(2,1,5); camera.updateMatrixWorld(); const rect={left:140,top:60,width:900,height:600};
  const got=subject(camera,365,510,rect), caster=new THREE.Raycaster(); caster.setFromCamera(new THREE.Vector2(-0.5,-0.5),camera);
  expect(got.direction.angleTo(caster.ray.direction)).toBeLessThan(1e-6);
}
