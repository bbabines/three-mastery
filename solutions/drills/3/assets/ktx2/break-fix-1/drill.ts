import type { Texture } from 'three';

export type TextureLoader = { loadAsync(url: string): Promise<Texture> };

export async function loadSwatches(urls: string[], loader: TextureLoader): Promise<Texture[]> {
  const pending = new Map<string, Promise<Texture>>();
  return Promise.all(urls.map((url) => {
    if (!pending.has(url)) pending.set(url, loader.loadAsync(url));
    return pending.get(url)!;
  }));
}
