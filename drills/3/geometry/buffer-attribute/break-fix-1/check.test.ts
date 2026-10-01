import { describe, it } from 'vitest';
import { vertexAt } from './drill';
import { checkBufferAttribute } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkBufferAttribute(vertexAt));
});
