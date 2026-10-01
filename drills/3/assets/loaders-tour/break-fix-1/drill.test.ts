import { describe, expect, it } from 'vitest';
import { configureCompressed } from './drill';

describe('configureCompressed', () => {
  it('attaches both decoders for the compressed product catalog', () => {
    const draco = { name: 'draco' }; const meshopt = { name: 'meshopt' };
    const received: string[] = [];
    const loader = {
      setDRACOLoader: (value: typeof draco) => { if (value === draco) received.push('draco'); },
      setMeshoptDecoder: (value: typeof meshopt) => { if (value === meshopt) received.push('meshopt'); },
    };
    configureCompressed(loader, draco, meshopt);
    expect(received).toEqual(['draco', 'meshopt']);
  });
});
