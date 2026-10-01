export function textureBytes(width: number, height: number): number {
  let bytes = 0;
  let w = width;
  let h = height;
  while (true) {
    bytes += w * h * 4;
    if (w === 1 && h === 1) return bytes;
    w = Math.max(1, Math.floor(w / 2));
    h = Math.max(1, Math.floor(h / 2));
  }
}
