import type { Answer } from '@harness/drill';
import { ShaderMaterial } from 'three';
export function circleMask(): Answer<ShaderMaterial> {
 // Cut a circular hole with a fragment-dependent mask, using `discard` only outside the kept area.
 return null;
}
