import type { Mesh, PerspectiveCamera, Scene } from 'three';
import type { Blocker } from './drill';

type Diagnose = (scene: Scene, camera: PerspectiveCamera, mesh: Mesh) => Blocker;

export function checkTriage(_diagnose: Diagnose): void {
  throw new Error('Write the regression check in check.ts');
}
