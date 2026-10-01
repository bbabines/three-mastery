import { describe, it } from 'vitest';
import { normalFromMap } from './drill';
import { checkTangentSpace } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkTangentSpace(normalFromMap));
});
