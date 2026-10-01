// Cache: reuse one request and choose a preload. Write the functions, save, and run: npm run drill -- drills/2/assets/reuse-caching/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The cached Promise for that URL.
export function cachedLoad(url: string, cache: Map<string, Promise<string>>, load: (url: string) => Promise<string>): Answer<Promise<string>> {
  let pending = cache.get(url);
  if (!pending) { pending = load(url); cache.set(url, pending); }
  return pending;
}

// The first likely asset within the remaining byte budget.
export function nextPreload(items: { url: string; likely: boolean; bytes: number }[], budgetBytes: number): Answer<string> {
  return items.find((item) => item.likely && item.bytes <= budgetBytes)?.url ?? '';
}
