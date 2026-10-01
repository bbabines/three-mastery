import {describe,it} from 'vitest';
import {roughMetal} from './drill';
import {checkRepair} from './check';
describe('regression check',()=>{it('rejects the original bug',()=>checkRepair(roughMetal));});
