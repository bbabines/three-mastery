import type { Answer } from '@harness/drill';
import type { ToneMapping } from 'three';
export type RendererTone = { toneMapping: ToneMapping; toneMappingExposure: number };
export function setExposureStops(renderer: RendererTone, stops: number): Answer<RendererTone> {
  // Mutate and return the supplied renderer settings.
  return null;
}
