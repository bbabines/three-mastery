import { describe, it } from 'vitest';
import { configurePart } from './drill';
import { checkFarPart } from './check';
describe('regression check',()=>{
  it('rejects the full shader on distant visible parts',()=>checkFarPart(configurePart));
});
