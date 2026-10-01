import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { stageWork } from './drill';

describe('stageWork', () => {
it('separates vertices from covered fragments over multiple passes', () => {
    expect(answered(stageWork(6,1920*1080,3))).toEqual({vertex:18,fragment:1920*1080*3});
    expect(answered(stageWork(1200,80,1))).toEqual({vertex:1200,fragment:80});
  });
});
