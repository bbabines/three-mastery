import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { estimatedDraws } from './drill';

describe('estimatedDraws', () => {
it('counts material groups, hidden branches, and shadow submissions', () => {
    const root = new THREE.Group(); const material = [new THREE.MeshBasicMaterial(),new THREE.MeshBasicMaterial()];
    const geometry = new THREE.BoxGeometry(); geometry.clearGroups(); geometry.addGroup(0,3,0); geometry.addGroup(3,3,1);
    const grouped = new THREE.Mesh(geometry,material); grouped.castShadow=true; root.add(grouped);
    const hidden = new THREE.Group(); hidden.visible=false; hidden.add(new THREE.Mesh()); root.add(hidden);
    expectNumber(estimatedDraws(root,1),4); expectNumber(estimatedDraws(root,2),6);
  });
});
