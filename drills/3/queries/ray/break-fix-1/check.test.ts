import { describe, it } from 'vitest';
import { sphereEntry } from './drill';
import { checkRay } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkRay(sphereEntry));
});
