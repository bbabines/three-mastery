import type { Object3D } from 'three';

type Hide = <T>(part: Object3D, probe: () => T) => T;

export function checkIsolation(_withHidden: Hide): void {
  throw new Error('Write the regression check in check.ts');
}
