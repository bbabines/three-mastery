import { describe, it } from 'vitest';
import { hasArrived } from './drill';
import { checkArrival } from './check';

describe('regression check', () => {
  it('rejects exact-only arrival', () => checkArrival(hasArrived));
});
