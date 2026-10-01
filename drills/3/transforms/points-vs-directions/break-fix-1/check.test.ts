import { describe, it } from 'vitest';
import { worldVelocity } from './drill';
import { checkVelocity } from './check';

describe('regression check', () => {
  it('rejects translation in a velocity', () => checkVelocity(worldVelocity));
});
