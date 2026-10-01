import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { sourceWidthForScreen } from './drill';

describe('sourceWidthForScreen', () => {
it('matches projected need without always taking the 4K original', () => {
    expectNumber(sourceWidthForScreen(220,2,4096),512);
    expectNumber(sourceWidthForScreen(800,2,1024),1024);
    expectNumber(sourceWidthForScreen(20,1,4096),32);
  });
});
