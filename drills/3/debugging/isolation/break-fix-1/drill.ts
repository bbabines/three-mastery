// Temporarily hide one suspected surface: diagnose the lost visibility state.
import type { Object3D } from 'three';

export function withHidden<T>(part: Object3D, probe: () => T): T {
  const wasVisible = part.visible;
  part.visible = false;
  const result = probe();
  part.visible = wasVisible;
  return result;
}
