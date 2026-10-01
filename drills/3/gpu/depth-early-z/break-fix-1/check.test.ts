import { describe, it } from 'vitest';
import { depthWork } from './drill';
import { checkDepthEarlyZ } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkDepthEarlyZ(depthWork));
});
