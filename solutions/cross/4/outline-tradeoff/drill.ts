import type { Answer } from '@harness/drill';

export interface OutlineWork { stencilCalls: number; postCalls: number; postPixels: number }
export function outlineWork(selectedDraws: number, width: number, height: number, dpr: number): Answer<OutlineWork> {
  return { stencilCalls: selectedDraws * 2, postCalls: selectedDraws + 1, postPixels: width * height * dpr * dpr };
}
