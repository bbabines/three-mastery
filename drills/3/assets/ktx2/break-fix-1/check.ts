import type { Texture } from 'three';
import type { TextureLoader } from './drill';

type Load = (urls: string[], loader: TextureLoader) => Promise<Texture[]>;

export async function checkSwatchReuse(_loadSwatches: Load): Promise<void> {
  throw new Error('Write the regression check in check.ts');
}
