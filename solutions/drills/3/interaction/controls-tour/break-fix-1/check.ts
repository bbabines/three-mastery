import * as THREE from 'three';
import { expect } from 'vitest';
import type { gizmoMode } from './drill';

export function checkControlsTour(subject: typeof gizmoMode): void {
  let calls=0; const orbit={enabled:true,update:()=>{calls++;}};
  subject(orbit,true); expect(orbit.enabled).toBe(false); subject(orbit,false); expect(calls).toBe(1);
}
