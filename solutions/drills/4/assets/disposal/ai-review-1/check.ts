import { expect } from 'vitest';
import { MeshStandardMaterial, Texture } from 'three';

type Retire = (oldMaterial: MeshStandardMaterial, nextMaterial: MeshStandardMaterial) => void;

export function checkSharedMap(retire: Retire): void {
  const shared = new Texture();
  const oldOnly = new Texture();
  const oldMaterial = new MeshStandardMaterial({ map: shared, roughnessMap: oldOnly });
  const nextMaterial = new MeshStandardMaterial({ map: shared });
  let sharedDisposals = 0, oldOnlyDisposals = 0;
  shared.addEventListener('dispose', () => { sharedDisposals += 1; });
  oldOnly.addEventListener('dispose', () => { oldOnlyDisposals += 1; });
  retire(oldMaterial, nextMaterial);
  expect(sharedDisposals, 'the next variant still owns this map').toBe(0);
  expect(oldOnlyDisposals, 'the retired variant alone owns this map').toBe(1);
}
