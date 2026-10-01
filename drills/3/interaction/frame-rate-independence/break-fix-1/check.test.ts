import { describe, it } from 'vitest';
import { smoothMove } from './drill';
import { checkFrameRateIndependence } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkFrameRateIndependence(smoothMove));
});
