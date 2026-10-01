import * as THREE from 'three';
import { expect } from 'vitest';
import type { focusView } from './drill';

export function checkOrbitPanDolly(subject: typeof focusView): void {
  const camera=new THREE.PerspectiveCamera(); camera.position.set(2,3,6); camera.lookAt(0,0,0); const orbit={target:new THREE.Vector3()}; const center=new THREE.Vector3(-4,2,1);
  const forward=camera.getWorldDirection(new THREE.Vector3());
  subject(camera,orbit,center,5); expect(orbit.target.distanceTo(center)).toBeLessThan(1e-6); expect(camera.position.distanceTo(center.clone().addScaledVector(forward,-5))).toBeLessThan(1e-6);
}
