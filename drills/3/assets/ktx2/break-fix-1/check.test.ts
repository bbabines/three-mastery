import { describe, it } from 'vitest';
import { loadSwatches } from './drill';
import { checkSwatchReuse } from './check';

describe('regression check', () => {
  it('rejects duplicate KTX2 transcodes', async () => checkSwatchReuse(loadSwatches));
});
