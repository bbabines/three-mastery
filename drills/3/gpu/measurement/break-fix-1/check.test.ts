import { describe, it } from 'vitest';
import { measureSubmission } from './drill';
import { checkMeasurement } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkMeasurement(measureSubmission));
});
