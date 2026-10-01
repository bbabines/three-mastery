import type { CompressedLoader } from './drill';

type Configure = <D, M>(loader: CompressedLoader<D, M>, draco: D, meshopt: M) => void;

export function checkDecoders(_configure: Configure): void {
  throw new Error('Write the regression check in check.ts');
}
