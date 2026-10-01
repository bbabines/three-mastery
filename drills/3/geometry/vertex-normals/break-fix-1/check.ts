import type { flatNormals } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkVertexNormals(_subject: typeof flatNormals): void {
  throw new Error('Write the regression check in check.ts');
}
