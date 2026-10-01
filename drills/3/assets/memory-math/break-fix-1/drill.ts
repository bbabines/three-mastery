// Runtime memory estimate: find the omitted GPU cost.
export function textureBytes(width: number, height: number): number {
  return width * height * 4;
}
