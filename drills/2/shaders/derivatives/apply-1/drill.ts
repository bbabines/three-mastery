import type { Answer } from '@harness/drill';
import { ShaderMaterial } from 'three';
export function aaWireGrid(): Answer<ShaderMaterial> {
 // Antialias UV grid lines by measuring neighboring pixel change with `fwidth`, without adding line geometry.
 return null;
}
