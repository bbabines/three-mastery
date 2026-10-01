import { describe, it } from 'vitest';
import { findSku } from './drill';
import { checkFindingObjects } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkFindingObjects(findSku));
});
