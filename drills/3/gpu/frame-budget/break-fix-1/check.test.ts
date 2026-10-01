import { describe, it } from 'vitest';
import { headroomMs } from './drill';
import { checkFrameBudget } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkFrameBudget(headroomMs));
});
