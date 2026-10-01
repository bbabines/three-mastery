import { expect } from 'vitest';
import { Object3D } from 'three';

type Hide = <T>(part: Object3D, probe: () => T) => T;

export function checkIsolation(withHidden: Hide): void {
  const part = new Object3D();
  expect(() => withHidden(part, () => { throw new Error('probe failed'); })).toThrow('probe failed');
  expect(part.visible, 'a failed isolation probe must restore the scene').toBe(true);
}
