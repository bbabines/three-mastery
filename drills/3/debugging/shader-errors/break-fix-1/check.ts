import type { MeshNormalMaterial } from 'three';

type Explain = (log: string, injectedLines: number) => { sourceLine: number; debugMaterial: MeshNormalMaterial };

export function checkLogLine(_explain: Explain): void {
  throw new Error('Write the regression check in check.ts');
}
