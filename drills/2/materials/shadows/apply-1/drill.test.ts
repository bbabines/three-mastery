import { answered } from '@harness/check';
import { DirectionalLight, Mesh, MeshStandardMaterial, PlaneGeometry, Texture } from 'three';
import { describe, expect, it } from 'vitest';
import { hybridFloor } from './drill';
describe('hybridFloor', () => {
 it('keeps static AO and moving shadow in separate paths', () => {
  const floor = new Mesh(new PlaneGeometry(), new MeshStandardMaterial());
  const material = new MeshStandardMaterial(), ao = new Texture(), key = new DirectionalLight();
  expect(answered(hybridFloor(floor,material,ao,key))).toBe(floor);
  expect(floor.material).toBe(material); expect(floor.receiveShadow).toBe(true);
  expect(material.aoMap).toBe(ao); expect(ao.channel).toBe(1);
  expect(key.castShadow).toBe(true);
 });
});
