import { describe, it } from 'vitest';
import { buildCutoutRack } from './drill';
import { checkCutoutRack } from './check';
describe('regression check',()=>{
  it('rejects blended cutout repeats',()=>checkCutoutRack(buildCutoutRack));
});
