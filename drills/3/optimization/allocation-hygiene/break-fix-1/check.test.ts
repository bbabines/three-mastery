import { describe, it } from 'vitest';
import { updateVariant } from './drill';
import { checkVariantReuse } from './check';
describe('regression check',()=>{
  it('keeps the same GPU texture across variant cycles',()=>checkVariantReuse(updateVariant));
});
