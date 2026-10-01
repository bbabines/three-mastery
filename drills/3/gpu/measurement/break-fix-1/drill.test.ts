import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { measureSubmission } from './drill';

describe('gpu.measurement', () => {
  it('repairs the reported symptom for a general case', () => {
    let tick=0; const fake={render:()=>{},info:{render:{calls:7}}}; expect(measureSubmission(fake,new THREE.Scene(),new THREE.Camera(),()=>[10,14][tick++])).toEqual({cpuMs:4,gpuMs:null,drawCalls:7});
  });
});
