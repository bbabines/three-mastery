import type { Object3D } from 'three';

export function withHidden<T>(part: Object3D, probe: () => T): T {
  const wasVisible = part.visible;
  part.visible = false;
  try { return probe(); }
  finally { part.visible = wasVisible; }
}
