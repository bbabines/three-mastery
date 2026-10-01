import { MeshNormalMaterial } from 'three';
import { describe, expect, it } from 'vitest';
import { explainShaderError } from './drill';

describe('explainShaderError', () => {
  it('maps generated-source lines back to the inserted edit', () => {
    for (const [reported, injected] of [[74, 50], [126, 100], [12, 0]]) {
      const result = explainShaderError(`ERROR: 0:${reported}: 'foo' : undeclared identifier`, injected);
      expect(result.sourceLine).toBe(reported - injected);
      expect(result.debugMaterial).toBeInstanceOf(MeshNormalMaterial);
    }
  });
});
