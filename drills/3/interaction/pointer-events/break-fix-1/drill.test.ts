import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { isClick } from './drill';

describe('interaction.pointer-events', () => {
  it('repairs the reported symptom for a general case', () => {
    const a=new THREE.Vector2(100,100); expect(isClick(a,new THREE.Vector2(103,104),3,6)).toBe(true);
    expect(isClick(a,new THREE.Vector2(110,100),1,6)).toBe(false);
  });
});
