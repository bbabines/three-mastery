import { describe, it } from 'vitest';
import { cameraOrientation } from './drill';
import { checkEuler } from './check';

describe('regression check', () => {
  it('rejects a different Euler order', () => checkEuler(cameraOrientation));
});
