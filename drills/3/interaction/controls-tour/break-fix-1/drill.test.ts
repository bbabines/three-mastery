import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { gizmoMode } from './drill';

describe('interaction.controls-tour', () => {
  it('repairs the reported symptom for a general case', () => {
    let updates=0; const orbit={enabled:true,update:()=>{updates++;}};
    expect(gizmoMode(orbit,true)).toBe(false); expect(orbit.enabled).toBe(false);
    expect(gizmoMode(orbit,false)).toBe(true); expect(updates).toBe(1);
  });
});
