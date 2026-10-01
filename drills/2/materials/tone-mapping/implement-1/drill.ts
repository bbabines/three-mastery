import type { Answer } from '@harness/drill';
import type { ToneMapping } from 'three';
export type ToneSetup = { toneMapping: ToneMapping; exposure: number };
export function productToneSetup(exposure: number): Answer<ToneSetup> {
  // Return the renderer settings for a color-critical lit product.
  return null;
}
