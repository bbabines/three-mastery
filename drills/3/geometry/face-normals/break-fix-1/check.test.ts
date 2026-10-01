import { describe, it } from 'vitest';
import { worldFaceNormal } from './drill';
import { checkFaceNormals } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkFaceNormals(worldFaceNormal));
});
