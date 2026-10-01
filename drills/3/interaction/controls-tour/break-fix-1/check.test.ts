import { describe, it } from 'vitest';
import { gizmoMode } from './drill';
import { checkControlsTour } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkControlsTour(gizmoMode));
});
