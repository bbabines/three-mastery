import * as THREE from 'three';
import { expect } from 'vitest';
import type { measureSubmission } from './drill';

export function checkMeasurement(subject: typeof measureSubmission): void {
  let tick=0; const fake={render:()=>{},info:{render:{calls:3}}}; expect(subject(fake,new THREE.Scene(),new THREE.Camera(),()=>[5,9][tick++])).toEqual({cpuMs:4,gpuMs:null,drawCalls:3});
}
