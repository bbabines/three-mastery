import {describe,it} from 'vitest';import {addPulse} from './drill';import {checkRepair} from './check';
describe('regression check',()=>{it('rejects the replacement shader',()=>checkRepair(addPulse));});
