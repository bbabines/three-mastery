import { expect } from 'vitest';
import type { MeshNormalMaterial } from 'three';

type Explain = (log: string, injectedLines: number) => { sourceLine: number; debugMaterial: MeshNormalMaterial };

export function checkLogLine(explain: Explain): void {
  expect(explain("ERROR: 0:81: 'uv' : undeclared identifier", 60).sourceLine, 'compiler lines include three.js additions').toBe(21);
}
