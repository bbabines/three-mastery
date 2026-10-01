import { describe, it } from 'vitest';
import { planFrame } from './drill';
import { checkIdleFrame } from './check';
describe('regression check',()=>{
  it('rejects redraws of an unchanged visible frame',()=>checkIdleFrame(planFrame));
});
