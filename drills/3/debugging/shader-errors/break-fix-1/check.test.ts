import { describe, it } from 'vitest';
import { explainShaderError } from './drill';
import { checkLogLine } from './check';

describe('regression check', () => {
  it('rejects the raw compiler line as an editor line', () => checkLogLine(explainShaderError));
});
