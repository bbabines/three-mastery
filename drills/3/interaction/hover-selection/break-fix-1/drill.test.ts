import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { nextEmphasis } from './drill';

describe('interaction.hover-selection', () => {
  it('repairs the reported symptom for a general case', () => {
    expect(nextEmphasis(false,true,1,0.1)).toBeGreaterThan(1);
    const once=nextEmphasis(true,false,1,0.1); const twice=nextEmphasis(true,false,nextEmphasis(true,false,1,0.05),0.05); expect(once).toBeCloseTo(twice,6);
  });
});
