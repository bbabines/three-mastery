import type { Command } from './drill';

type Count = (commands: Command[]) => number;

export function checkDrawCount(_count: Count): void {
  throw new Error('Write the regression check in check.ts');
}
