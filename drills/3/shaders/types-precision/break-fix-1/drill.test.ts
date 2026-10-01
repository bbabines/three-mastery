import {describe,expect,it} from 'vitest';

import {glslFloat} from './drill';
describe('glslFloat',()=>{it('repairs the effect across inputs',()=>{ expect(glslFloat(1)).toBe("1.0");expect(glslFloat(-2)).toBe("-2.0");expect(glslFloat(.25)).toBe("0.25"); });});
