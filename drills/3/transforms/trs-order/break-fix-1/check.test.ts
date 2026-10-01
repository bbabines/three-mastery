import { describe, it } from 'vitest';
import { posePreview } from './drill';
import { checkPose } from './check';

describe('regression check', () => {
  it('rejects a scale-before-rotation pose', () => checkPose(posePreview));
});
