import { expect } from 'vitest';
import type { CompressedLoader } from './drill';

type Configure = <D, M>(loader: CompressedLoader<D, M>, draco: D, meshopt: M) => void;

export function checkDecoders(configure: Configure): void {
  const draco = {}; const meshopt = {};
  const called: string[] = [];
  const loader = {
    setDRACOLoader: (value: typeof draco) => { if (value === draco) called.push('draco'); },
    setMeshoptDecoder: (value: typeof meshopt) => { if (value === meshopt) called.push('meshopt'); },
  };
  configure(loader, draco, meshopt);
  expect(called, 'a Meshopt asset needs its decoder attached').toEqual(['draco', 'meshopt']);
}
