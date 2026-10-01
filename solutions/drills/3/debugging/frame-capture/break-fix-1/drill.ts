export type Command = { op: string; count?: number };

export function drawCount(commands: Command[]): number {
  const draws = new Set(['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced']);
  return commands.filter((command) => draws.has(command.op)).length;
}
