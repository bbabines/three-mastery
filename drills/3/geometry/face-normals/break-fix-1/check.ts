import type { worldFaceNormal } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkFaceNormals(_subject: typeof worldFaceNormal): void {
  throw new Error('Write the regression check in check.ts');
}
