import * as THREE from 'three';
import { expect } from 'vitest';
import type { passCost } from './drill';

export function checkMultiPass(subject: typeof passCost): void {
  expect(subject(1920,1080,4)).toEqual({fullScreenFragments:8294400,needsOutputPass:true});
  expect(subject(640,360,1)).toEqual({fullScreenFragments:230400,needsOutputPass:true});
}
