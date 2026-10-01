import {describe,it} from 'vitest';import {gridShader} from './drill';import {checkRepair} from './check';
describe('regression check',()=>{it('rejects the fixed-width shader',()=>checkRepair(gridShader));});
