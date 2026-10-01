import { describe, expect, it } from 'vitest';
import { drawCount } from './drill';

describe('drawCount', () => {
  it('counts every draw operation across offscreen and main passes', () => {
    const commands = [
      { op: 'bindFramebuffer' }, { op: 'drawElements', count: 36 },
      { op: 'bindFramebuffer' }, { op: 'drawElementsInstanced', count: 36 },
      { op: 'drawArrays', count: 6 }, { op: 'drawArraysInstanced', count: 6 },
      { op: 'useProgram' }, { op: 'clear' },
    ];
    expect(drawCount(commands)).toBe(4);
    expect(drawCount(commands.slice(0, 2))).toBe(1);
  });
});
