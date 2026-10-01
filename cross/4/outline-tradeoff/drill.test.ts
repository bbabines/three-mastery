import { answered } from '@harness/check';
import { describe, expect, it } from 'vitest';
import { outlineWork } from './drill';

describe('outline work trade-off', () => {
  it.each([[1,400,300,1],[25,400,300,2],[4,1200,800,1.5]])('counts selected draws and full-screen pixels', (draws,w,h,dpr) => {
    const result = answered(outlineWork(draws,w,h,dpr));
    expect(result).toEqual({stencilCalls:draws*2,postCalls:draws+1,postPixels:w*h*dpr*dpr});
  });
});
