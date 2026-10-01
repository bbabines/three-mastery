// KTX2 swatch library: diagnose duplicate in-flight loads.
import type { Texture } from 'three';

export type TextureLoader = { loadAsync(url: string): Promise<Texture> };

export async function loadSwatches(urls: string[], loader: TextureLoader): Promise<Texture[]> {
  return Promise.all(urls.map((url) => loader.loadAsync(url)));
}
