import type { Answer } from '@harness/drill';

export function softFade(sceneDepth: number, particleDepth: number, fadeDistance: number): Answer<number> {
  return Math.max(0, Math.min(1, (sceneDepth - particleDepth) / fadeDistance));
}
