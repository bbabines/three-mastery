import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { fitAndPixelSize } from './drill';

describe('camera.fit-to-bounds', () => {
  it('repairs the reported symptom for a general case', () => {
    const landscape=fitAndPixelSize(2,60,2,600), portrait=fitAndPixelSize(2,60,0.5,600);
    expect(portrait.distance).toBeGreaterThan(landscape.distance);
    const half=Math.atan(Math.tan(Math.PI/6)*0.5); expect(Math.asin(2/portrait.distance)).toBeLessThanOrEqual(half+1e-6);
    expect(portrait.unitsPerPixel).toBeCloseTo(2*portrait.distance*Math.tan(Math.PI/6)/600,6);
  });
});
