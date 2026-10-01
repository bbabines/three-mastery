import { describe, it } from 'vitest';
import { canSee } from './drill';
import { checkScanner } from './check';

describe('regression check', () => {
  it('rejects the broken scanner', () => checkScanner(canSee));
});
