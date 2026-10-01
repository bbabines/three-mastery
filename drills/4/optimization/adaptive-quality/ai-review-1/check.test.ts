import { describe, it } from 'vitest';
import { nextDpr } from './drill';
import { checkDeadBand } from './check';

describe('AI review regression check', () => {
  it('rejects a quality controller without a dead band', () => checkDeadBand(nextDpr));
});
