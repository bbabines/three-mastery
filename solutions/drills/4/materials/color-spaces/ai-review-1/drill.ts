import { NoColorSpace, SRGBColorSpace, Texture } from 'three';
export function configureMaps(color: Texture, normal: Texture): void {
  color.colorSpace = SRGBColorSpace;
  normal.colorSpace = NoColorSpace;
}
