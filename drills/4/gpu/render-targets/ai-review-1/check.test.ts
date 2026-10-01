import { describe, it } from 'vitest';
import { renderThumbnail } from './drill';
import { checkTargetRestore } from './check';

describe('AI review regression check', () => {
  it('rejects a helper that leaves the thumbnail bound', () => checkTargetRestore(renderThumbnail));
});
