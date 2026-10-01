import * as THREE from 'three';
import { expect } from 'vitest';
import type { drawSubmissions } from './drill';

export function checkDrawCallAnatomy(subject: typeof drawSubmissions): void {
  expect(subject([{groups:2,visible:true},{groups:4,visible:true},{groups:8,visible:false}],1)).toBe(12);
}
