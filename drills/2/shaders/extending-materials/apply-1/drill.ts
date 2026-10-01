import type { Answer } from '@harness/drill';
import { MeshStandardMaterial } from 'three';
export function injectEmissivePulse(material: MeshStandardMaterial, strength: number): Answer<MeshStandardMaterial> {
 // Add an onBeforeCompile hook while keeping the built-in lighting shader.
 return null;
}
