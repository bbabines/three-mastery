import { expect } from 'vitest';
import type { Command } from './drill';

type Count = (commands: Command[]) => number;

export function checkDrawCount(count: Count): void {
  const trace: Command[] = [
    { op: 'bindFramebuffer' }, { op: 'drawElements', count: 24 },
    { op: 'bindFramebuffer' }, { op: 'drawElementsInstanced', count: 24 },
  ];
  expect(count(trace), 'offscreen and instanced draws are still draw calls').toBe(2);
}
