import type { frameWork } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkPipelineStages(_subject: typeof frameWork): void {
  throw new Error('Write the regression check in check.ts');
}
