import type { drawSubmissions } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkDrawCallAnatomy(_subject: typeof drawSubmissions): void {
  throw new Error('Write the regression check in check.ts');
}
