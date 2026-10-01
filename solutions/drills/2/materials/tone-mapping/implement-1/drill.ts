import type { Answer } from '@harness/drill';
import { NeutralToneMapping, type ToneMapping } from 'three';
export type ToneSetup = { toneMapping: ToneMapping; exposure: number };
export function productToneSetup(exposure: number): Answer<ToneSetup> {
  return { toneMapping: NeutralToneMapping, exposure: Math.max(0.01, exposure) };
}
