import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { productIdForHit } from './drill';

describe('productIdForHit', () => {
it('finds the nearest tagged ancestor, not just the direct parent', () => {
    const root = new THREE.Group(); root.userData.productId = 'rack';
    const part = new THREE.Group(); part.userData.productId = 'cup';
    const middle = new THREE.Group(); const hit = new THREE.Mesh();
    root.add(part); part.add(middle); middle.add(hit);
    expectExact(productIdForHit(hit), 'cup');
    expectExact(productIdForHit(new THREE.Mesh()), '');
  });
});
