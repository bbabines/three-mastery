type Decide = (previous: number, frameMs: number) => number;

export function checkDeadBand(_nextDpr: Decide): void {
  throw new Error('Write the regression check in check.ts');
}
