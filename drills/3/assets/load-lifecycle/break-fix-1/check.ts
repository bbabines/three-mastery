import type { Candidate } from './drill';

type Preload = <T>(items: Candidate[], load: (url: string) => Promise<T>) => Promise<T[]>;

export async function checkPreloadFailure(_preload: Preload): Promise<void> {
  throw new Error('Write the regression check in check.ts');
}
