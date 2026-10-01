import { describe, it } from 'vitest';
import { placeInstance } from './drill';
import { checkObjectTypesTour } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkObjectTypesTour(placeInstance));
});
