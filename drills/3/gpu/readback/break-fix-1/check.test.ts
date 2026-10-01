import { describe, it } from 'vitest';
import { pickPixel } from './drill';
import { checkReadback } from './check';

describe('regression check', () => {
  it('rejects the original bug', async () => checkReadback(pickPixel));
});
