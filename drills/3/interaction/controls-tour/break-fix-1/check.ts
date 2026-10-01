import type { gizmoMode } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkControlsTour(_subject: typeof gizmoMode): void {
  throw new Error('Write the regression check in check.ts');
}
