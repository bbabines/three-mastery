import type { Answer } from '@harness/drill';
import { ShaderMaterial } from 'three';
export function cssChecker(dpr: number): Answer<ShaderMaterial> {
 // Build a checker in CSS pixels by converting `gl_FragCoord.xy` from device pixels using the supplied DPR.
 return null;
}
