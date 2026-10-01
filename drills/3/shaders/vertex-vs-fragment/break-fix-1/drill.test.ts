import {describe,expect,it} from 'vitest';

import {shaderRuns} from './drill';
describe('shaderRuns',()=>{it('repairs the effect across inputs',()=>{ expect(shaderRuns(200,1000,2,3,2)).toEqual({vertex:400,fragment:12000});expect(shaderRuns(50,500,.5,2,3)).toEqual({vertex:150,fragment:250}); });});
