import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { cachedLoad, nextPreload } from './drill';

describe('cachedLoad', () => {
it('starts only one load for repeated parts', async () => {
    const cache = new Map<string,Promise<string>>(); let calls = 0;
    const load = (url: string) => { calls++; return Promise.resolve(url); };
    const first = answered(cachedLoad('/rack.glb',cache,load));
    const second = answered(cachedLoad('/rack.glb',cache,load));
    expect(first).toBe(second); expect(await second).toBe('/rack.glb'); expect(calls).toBe(1);
  });
});

describe('nextPreload', () => {
it('avoids an unlikely or over-budget preload', () => {
    const items = [{url:'huge',likely:true,bytes:900},{url:'rare',likely:false,bytes:10},{url:'next',likely:true,bytes:80}];
    expectExact(nextPreload(items,100), 'next'); expectExact(nextPreload(items,20), '');
  });
});
