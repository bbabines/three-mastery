import { describe, it } from 'vitest';
import { isMirrored } from './drill';
import { checkMirror } from './check';

describe('regression check', () => {
  it('rejects an axis-component mirror test', () => checkMirror(isMirrored));
});
