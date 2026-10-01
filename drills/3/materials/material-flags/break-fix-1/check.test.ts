import {describe,it} from 'vitest';
import { perforatedPanel } from './drill';
import {checkRepair} from './check';
describe('regression check',()=>{it('rejects the original bug',()=>checkRepair(perforatedPanel));});
