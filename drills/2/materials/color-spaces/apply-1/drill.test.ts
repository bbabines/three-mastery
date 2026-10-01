import { answered } from '@harness/check';
import { Color, MeshBasicMaterial } from 'three';
import { describe, expect, it } from 'vitest';
import { matchPicker } from './drill';

describe('matchPicker', () => {
  it('uses the picker color and avoids tone mapping', () => {
    for (const cssColor of ['#c7762f', '#3478bb', 'rgb(120, 180, 80)']) {
      const material = new MeshBasicMaterial({ color: '#ffffff' });
      const result = answered(matchPicker(material, cssColor));
      expect(result).toBe(material);
      expect(material.color.equals(new Color().setStyle(cssColor))).toBe(true);
      expect(material.toneMapped).toBe(false);
    }
  });
});
