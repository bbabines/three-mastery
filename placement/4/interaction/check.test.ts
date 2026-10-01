import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import * as check from './check';

describe('interaction.controls-tour', () => {
  it('makes the right judgment', () => {
    const c={enableDamping:false}; expect(answered(check.enableSmoothOrbit(c))).toBe(true);
  });
});

describe('interaction.pointer-events', () => {
  it('makes the right judgment', () => {
    expect(answered(check.pointerNdc(50,75,10,25,80,100))).toEqual(new THREE.Vector2(0,0));
  });
});

describe('interaction.click-vs-drag', () => {
  it('makes the right judgment', () => {
    expect(answered(check.isDrag(new THREE.Vector2(),new THREE.Vector2(3,4),4))).toBe(true); expect(answered(check.isDrag(new THREE.Vector2(),new THREE.Vector2(3,4),6))).toBe(false);
  });
});

describe('interaction.hover-selection', () => {
  it('makes the right judgment', () => {
    expect(answered(check.nextHover('a','b'))).toBe('a'); expect(check.nextHover('a','a')).toBeNull();
  });
});

describe('interaction.orbit-pan-dolly', () => {
  it('makes the right judgment', () => {
    expect(answered(check.clampedDistance(5,-10,2,9))).toBe(2); expect(answered(check.clampedDistance(5,2,2,9))).toBe(7);
  });
});

describe('interaction.drag-on-plane', () => {
  it('makes the right judgment', () => {
    expect(answered(check.dragOrigin(new THREE.Vector3(4,0,0),new THREE.Vector3(1,0,0),new THREE.Vector3(0,0,0)))).toEqual(new THREE.Vector3(3,0,0));
  });
});

describe('interaction.axis-drag', () => {
  it('makes the right judgment', () => {
    const m=new THREE.Vector3(2,3,1),a=new THREE.Vector3(1,1,0); expect(answered(check.railDelta(m,a))).toEqual(m.clone().projectOnVector(a));
  });
});

describe('interaction.local-world-manipulation', () => {
  it('makes the right judgment', () => {
    const o=new THREE.Object3D(); o.rotation.y=Math.PI/2; expect(answered(check.worldAxis(o,new THREE.Vector3(0,0,1))).x).toBeCloseTo(1);
  });
});

describe('interaction.controls-coexistence', () => {
  it('makes the right judgment', () => {
    expect(answered(check.orbitAllowed(true))).toBe(false); expect(answered(check.orbitAllowed(false))).toBe(true);
  });
});

describe('interaction.focus-on-object', () => {
  it('makes the right judgment', () => {
    const o=new THREE.Mesh(new THREE.BoxGeometry(2,2,2)); o.position.x=3; expect(answered(check.focusCenter(o)).x).toBeCloseTo(3);
  });
});

describe('interaction.anchoring', () => {
  it('makes the right judgment', () => {
    const c=new THREE.PerspectiveCamera(); c.position.z=5; expect(answered(check.anchorPixels(c,new THREE.Vector3(),800,400))).toEqual(new THREE.Vector2(400,200));
  });
});

describe('interaction.frame-rate-independence', () => {
  it('makes the right judgment', () => {
    const a=answered(check.dampingAlpha(5,0.2)), half=answered(check.dampingAlpha(5,0.1)); expect(a).toBeCloseTo(1-(1-half)*(1-half));
  });
});

describe('interaction.interpolation-toolbox', () => {
  it('makes the right judgment', () => {
    expect(answered(check.smoothFraction(0))).toBe(0); expect(answered(check.smoothFraction(0.5))).toBeCloseTo(0.5); expect(answered(check.smoothFraction(2))).toBe(1);
  });
});
