// Captured frame: find the draw operations this counter misses.
export type Command = { op: string; count?: number };

export function drawCount(commands: Command[]): number {
  return commands.filter((command) => command.op === 'drawArrays').length;
}
