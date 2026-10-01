import { answered } from '@harness/check';
import { MeshStandardMaterial, PointLight, RectAreaLight, Vector3 } from 'three';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { describe, expect, it, vi } from 'vitest';
import { studioLights } from './drill';
describe('studioLights', () => {
 it('sizes the area light and uses physical point-light power', () => {
  const init = vi.spyOn(RectAreaLightUniformsLib, 'init');
  for (const [width,height,power] of [[1,2,300],[3,1,900]]) {
   const { softbox, fill, surface } = answered(studioLights(width,height,power));
   expect(softbox).toBeInstanceOf(RectAreaLight); expect(softbox.width).toBe(width); expect(softbox.height).toBe(height);
   expect(fill).toBeInstanceOf(PointLight); expect(fill.power).toBeCloseTo(power);
   expect(surface).toBeInstanceOf(MeshStandardMaterial);
   expect(softbox.position.length()).toBeGreaterThan(0);
   const direction = new Vector3(0,0,1).applyQuaternion(softbox.quaternion);
   expect(direction.dot(softbox.position.clone().negate().normalize())).toBeGreaterThan(.8);
  }
  expect(init).toHaveBeenCalled();
  init.mockRestore();
 });
});
