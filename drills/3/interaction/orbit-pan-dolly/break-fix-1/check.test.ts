import { describe, it } from 'vitest';
import { focusView } from './drill';
import { checkOrbitPanDolly } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkOrbitPanDolly(focusView));
});
