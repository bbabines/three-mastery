import { describe, it } from 'vitest';
import { flatNormals } from './drill';
import { checkVertexNormals } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkVertexNormals(flatNormals));
});
