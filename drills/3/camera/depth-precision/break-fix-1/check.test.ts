import { describe, it } from 'vitest';
import { depthBufferValue } from './drill';
import { checkDepthPrecision } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkDepthPrecision(depthBufferValue));
});
