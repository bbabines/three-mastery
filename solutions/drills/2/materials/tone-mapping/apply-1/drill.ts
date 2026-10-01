import type { Answer } from '@harness/drill';
import { NeutralToneMapping, type ToneMapping } from 'three';
export type RendererTone = { toneMapping: ToneMapping; toneMappingExposure: number };
export function setExposureStops(renderer: RendererTone, stops: number): Answer<RendererTone> {
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 2 ** stops;
  return renderer;
}
