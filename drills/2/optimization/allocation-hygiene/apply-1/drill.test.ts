import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { boundsInto } from './drill';

describe('boundsInto', () => {
it('returns the caller box and follows a moved model', () => {
    const root=new THREE.Group(); const mesh=new THREE.Mesh(new THREE.BoxGeometry()); root.add(mesh); const scratch=new THREE.Box3();
    const first=answered(boundsInto(root,scratch)); expect(first).toBe(scratch); expectVector(first.getCenter(new THREE.Vector3()),new THREE.Vector3());
    root.position.x=4; const second=answered(boundsInto(root,scratch)); expect(second).toBe(scratch); expectVector(second.getCenter(new THREE.Vector3()),new THREE.Vector3(4,0,0));
  });
});
