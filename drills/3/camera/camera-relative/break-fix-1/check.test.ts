import { describe, it } from 'vitest';
import { cameraRight } from './drill';
import { checkCameraRelative } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkCameraRelative(cameraRight));
});
