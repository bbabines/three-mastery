import type { Answer } from '@harness/drill';
export type Runs = { vertex: number; fragment: number };
export function shaderRuns(vertices: number, coveredCssPixels: number, dpr: number, overdraw: number, passes: number): Answer<Runs> {
 // Return invocation estimates for the supplied draw.
 return null;
}
