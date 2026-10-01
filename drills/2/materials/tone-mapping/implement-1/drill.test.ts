import { answered } from '@harness/check';
import { NeutralToneMapping } from 'three';
import { describe, expect, it } from 'vitest';
import { productToneSetup } from './drill';
describe('productToneSetup', () => {
 it('uses Neutral for a color-critical product at different exposures', () => {
  for (const exposure of [0.5, 1, 2.3]) {
   const result = answered(productToneSetup(exposure));
   expect(result.toneMapping).toBe(NeutralToneMapping);
   expect(result.exposure).toBe(exposure);
  }
 });
 it('does not hand the renderer a nonpositive exposure', () => {
  expect(answered(productToneSetup(-2)).exposure).toBeGreaterThan(0);
  expect(answered(productToneSetup(0)).exposure).toBeGreaterThan(0);
 });
});
