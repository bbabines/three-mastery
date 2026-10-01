import { describe, it } from 'vitest';
import { fitAndPixelSize } from './drill';
import { checkFitToBounds } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkFitToBounds(fitAndPixelSize));
});
