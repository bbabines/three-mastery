import { describe, it } from 'vitest';
import { worldSurface } from './drill';
import { checkSurface } from './check';

describe('regression check', () => {
  it('rejects a stretched direction used as a normal', () => checkSurface(worldSurface));
});
