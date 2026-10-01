import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { labelPosition } from './drill';

describe('camera.project-unproject', () => {
  it('project a world point to screen pixels for a label, retaining its ndc depth for an off-screen check', () => {
    const camera=new THREE.PerspectiveCamera(60,800/600,0.1,100); camera.position.set(2,1,5); camera.lookAt(0,0,0); const p=new THREE.Vector3(1,0,0), before=p.clone();
    const screen=answered(labelPosition(camera,p,800,600));
    const ndc=new THREE.Vector3(2*screen.x/800-1,1-2*screen.y/600,screen.z);
    expect(ndc.unproject(camera).distanceTo(p)).toBeLessThan(1e-5);
    expect(p.equals(before)).toBe(true);
  });
});
