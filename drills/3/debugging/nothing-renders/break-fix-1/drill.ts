// Invisible loaded model: diagnose the unchecked world transform.
import type { Mesh } from 'three';

export function canAppear(mesh: Mesh): boolean {
  return mesh.parent !== null && mesh.visible;
}
