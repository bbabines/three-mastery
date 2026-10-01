import { describe, it } from 'vitest';
import { revealVariant } from './drill';
import { checkPreparedReveal } from './check';
describe('regression check',()=>{
  it('rejects a reveal before resources are prepared',async()=>checkPreparedReveal(revealVariant));
});
