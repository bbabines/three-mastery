import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { authoredShaderLine, debugViewMaterial } from './drill';

describe('authoredShaderLine', () => {
it('reads the compiled line and accounts for injected lines', () => {
    expectNumber(authoredShaderLine('ERROR: 0:137: undeclared identifier',120),17);
    expectNumber(authoredShaderLine('no line number',120),-1);
  });
});

describe('debugViewMaterial', () => {
it('uses dedicated normal and depth views and a wireframe fallback', () => {
    const normal=answered(debugViewMaterial('normal')); expect(normal).toBeInstanceOf(THREE.MeshNormalMaterial);
    const depth=answered(debugViewMaterial('depth')); expect(depth).toBeInstanceOf(THREE.MeshDepthMaterial);
    const wire=answered(debugViewMaterial('wireframe')) as THREE.MeshBasicMaterial; expect(wire.wireframe).toBe(true);
    normal.dispose(); depth.dispose(); wire.dispose();
  });
});
