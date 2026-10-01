import { describe, it } from 'vitest';
import { slideOnWall } from './drill';
import { checkWallSlide } from './check';

describe('AI review regression check', () => {
  it('rejects a helper that changes the caller’s velocity', () => checkWallSlide(slideOnWall));
});
