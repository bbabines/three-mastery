import {describe,it} from 'vitest';
import {uvGradient} from './drill';
import {checkRepair} from './check';
describe('regression check',()=>{it('rejects the original shader',()=>checkRepair(uvGradient));});
