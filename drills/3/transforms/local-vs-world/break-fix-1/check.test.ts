import { describe, it } from 'vitest';
import { lampPosition } from './drill';
import { checkLamp } from './check';

describe('regression check', () => {
  it('rejects a local-space lamp position', () => checkLamp(lampPosition));
});
