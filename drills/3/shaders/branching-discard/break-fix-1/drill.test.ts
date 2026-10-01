import {describe,expect,it} from 'vitest';

import {maskFragmentRuns} from './drill';
describe('maskFragmentRuns',()=>{it('repairs the effect across inputs',()=>{ expect(maskFragmentRuns(1000,3,.75)).toBe(3000);expect(maskFragmentRuns(250,2,0)).toBe(500); });});
