// Shader compile log: find the line-number mapping error.
import { MeshNormalMaterial } from 'three';

export function explainShaderError(log: string, injectedLines: number): { sourceLine: number; debugMaterial: MeshNormalMaterial } {
  const reported = Number(log.match(/ERROR:\s*\d+:(\d+):/)?.[1] ?? 0);
  return { sourceLine: reported, debugMaterial: new MeshNormalMaterial() };
}
