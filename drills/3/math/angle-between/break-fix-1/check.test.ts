import { describe, it } from 'vitest';
import { orbitTurn } from './drill';
import { checkOrbit } from './check';

describe('regression check', () => {
  it('rejects an unsigned orbit turn', () => checkOrbit(orbitTurn));
});
