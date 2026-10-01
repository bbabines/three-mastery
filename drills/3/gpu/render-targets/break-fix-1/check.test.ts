import { describe, it } from 'vitest';
import { captureThumbnail } from './drill';
import { checkRenderTargets } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkRenderTargets(captureThumbnail));
});
