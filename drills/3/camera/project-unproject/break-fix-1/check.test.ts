import { describe, it } from 'vitest';
import { labelVisible } from './drill';
import { checkProjectUnproject } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkProjectUnproject(labelVisible));
});
