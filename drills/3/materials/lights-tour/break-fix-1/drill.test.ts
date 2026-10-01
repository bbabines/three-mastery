import { MeshStandardMaterial, RectAreaLight } from 'three';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { describe, expect, it, vi } from 'vitest';
import { ceilingPanel } from './drill';
describe('ceilingPanel',()=>{
 it('uses an area-light-compatible surface and initializes its shader support',()=>{
  const init=vi.spyOn(RectAreaLightUniformsLib,'init'); const result=ceilingPanel(2,3);
  expect(result.surface).toBeInstanceOf(MeshStandardMaterial); expect(result.light).toBeInstanceOf(RectAreaLight);
  expect(init).toHaveBeenCalled(); init.mockRestore();
 });
 it('keeps the requested panel dimensions',()=>{const {light}=ceilingPanel(1.5,2.5);expect([light.width,light.height]).toEqual([1.5,2.5]);});
});
