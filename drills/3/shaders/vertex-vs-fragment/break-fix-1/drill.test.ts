import {describe,expect,it} from 'vitest';

import {shaderRuns} from './drill';
describe('shaderRuns',()=>{it('counts overdraw in every equal-size pass',()=>{ expect(shaderRuns(200,1000,2,3,2)).toEqual({vertex:400,fragment:24000});expect(shaderRuns(50,500,.5,2,3)).toEqual({vertex:150,fragment:750}); });});
