import {describe,it} from 'vitest';
import {softRing} from './drill';
import {checkRepair} from './check';
describe('regression check',()=>{it('rejects the original shader',()=>checkRepair(softRing));});
