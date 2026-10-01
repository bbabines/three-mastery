import { describe, it } from 'vitest';
import { nextEmphasis } from './drill';
import { checkHoverSelection } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkHoverSelection(nextEmphasis));
});
