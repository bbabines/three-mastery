import type { Answer } from '@harness/drill';
export type Runs = { vertex: number; fragment: number };
export function shaderRuns(vertices: number, coveredCssPixels: number, dpr: number, overdraw: number, passes: number): Answer<Runs> {
 return { vertex: vertices * passes, fragment: coveredCssPixels * dpr * dpr * overdraw };
}
