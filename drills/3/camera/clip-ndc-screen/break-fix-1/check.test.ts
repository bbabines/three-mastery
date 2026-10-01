import { describe, it } from 'vitest';
import { screenY } from './drill';
import { checkClipNdcScreen } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkClipNdcScreen(screenY));
});
