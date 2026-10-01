import { describe, it } from 'vitest';
import { frameWork } from './drill';
import { checkPipelineStages } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkPipelineStages(frameWork));
});
