import { describe, it } from 'vitest';
import { labelState } from './drill';
import { checkAnchoring } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkAnchoring(labelState));
});
