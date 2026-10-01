import { describe, it } from 'vitest';
import { moveByWorld } from './drill';
import { checkLocalWorldManipulation } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkLocalWorldManipulation(moveByWorld));
});
