import { describe, it } from 'vitest';
import { retireMaterial } from './drill';
import { checkSharedMap } from './check';

describe('AI review regression check', () => {
  it('rejects disposal of a shared map', () => checkSharedMap(retireMaterial));
});
