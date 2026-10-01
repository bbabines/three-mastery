import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { passCost } from './drill';

describe('gpu.multi-pass', () => {
  it('counts every full-screen pass and requires final output conversion', () => {
    expect(passCost(800,600,3)).toEqual({fullScreenFragments:1440000,needsOutputPass:true});
    expect(passCost(400,300,1)).toEqual({fullScreenFragments:120000,needsOutputPass:true});
  });
});
