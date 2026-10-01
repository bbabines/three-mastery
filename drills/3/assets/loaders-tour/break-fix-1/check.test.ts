import { describe, it } from 'vitest';
import { configureCompressed } from './drill';
import { checkDecoders } from './check';

describe('regression check', () => {
  it('rejects a loader missing Meshopt setup', () => checkDecoders(configureCompressed));
});
