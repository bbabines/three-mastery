import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { drawSubmissions } from './drill';

describe('gpu.draw-call-anatomy', () => {
  it('counts visible material groups once per main and shadow pass', () => {
    expect(drawSubmissions([{groups:3,visible:true},{groups:1,visible:true},{groups:5,visible:false}],2)).toBe(12);
    expect(drawSubmissions([{groups:4,visible:false},{groups:2,visible:true}],0)).toBe(2);
  });
});
