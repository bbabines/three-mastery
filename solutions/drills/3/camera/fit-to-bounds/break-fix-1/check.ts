import * as THREE from 'three';
import { expect } from 'vitest';
import type { fitAndPixelSize } from './drill';

export function checkFitToBounds(subject: typeof fitAndPixelSize): void {
  const got=subject(3,50,0.4,720); const half=Math.atan(Math.tan(THREE.MathUtils.degToRad(50)/2)*0.4);
  expect(Math.asin(3/got.distance)).toBeLessThanOrEqual(half+1e-6);
  const c=new THREE.PerspectiveCamera(50,0.4,0.1,100); expect(new THREE.Vector3(0,got.unitsPerPixel/2,-got.distance).project(c).y*720).toBeCloseTo(1,5);
}
