import { describe, it } from 'vitest';
import { isClick } from './drill';
import { checkPointerEvents } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkPointerEvents(isClick));
});
