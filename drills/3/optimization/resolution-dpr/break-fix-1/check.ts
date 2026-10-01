import type { RatioRenderer } from './drill';

type Apply = (renderer: RatioRenderer, deviceRatio: number) => number;

export function checkPhoneBudget(_apply: Apply): void {
  throw new Error('Write the regression check in check.ts');
}
