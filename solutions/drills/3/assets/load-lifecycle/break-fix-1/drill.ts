export type Candidate = { url: string; likely: boolean };

export async function preloadLikely<T>(items: Candidate[], load: (url: string) => Promise<T>): Promise<T[]> {
  return Promise.all(items.filter((item) => item.likely).map((item) => load(item.url)));
}
