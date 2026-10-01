import { describe, it } from 'vitest';
import { canAppear } from './drill';
import { checkDegenerate } from './check';

describe('regression check', () => {
  it('rejects a loaded-visible shortcut for a singular transform', () => checkDegenerate(canAppear));
});
