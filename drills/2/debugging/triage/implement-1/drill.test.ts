import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { firstFailure } from './drill';

describe('firstFailure', () => {
it('uses the first failed stage instead of blaming the shader', () => {
    const ready = {inScene:true,inView:true,hasVertices:true,hasMaterial:true,shaderLinked:true};
    expectExact(firstFailure({...ready,inScene:false,shaderLinked:false}),'scene');
    expectExact(firstFailure({...ready,inView:false}),'camera');
    expectExact(firstFailure({...ready,hasVertices:false}),'geometry');
    expectExact(firstFailure({...ready,hasMaterial:false}),'material');
    expectExact(firstFailure({...ready,shaderLinked:false}),'pipeline');
    expectExact(firstFailure(ready),'ready');
  });
});
