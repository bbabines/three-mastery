import { describe, it } from 'vitest';
import { drawSubmissions } from './drill';
import { checkDrawCallAnatomy } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkDrawCallAnatomy(drawSubmissions));
});
