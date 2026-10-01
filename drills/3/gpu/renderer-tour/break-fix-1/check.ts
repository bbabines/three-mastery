import type { prepareStudio } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkRendererTour(_subject: typeof prepareStudio): void {
  throw new Error('Write the regression check in check.ts');
}
