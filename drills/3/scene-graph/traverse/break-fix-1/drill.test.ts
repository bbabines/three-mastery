import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { visibleMeshCount } from './drill';

describe('scene-graph.traverse', () => {
  it('repairs the reported symptom for a general case', () => {
    const root=new THREE.Group(), shown=new THREE.Mesh(), hidden=new THREE.Group(); hidden.visible=false; hidden.add(new THREE.Mesh()); root.add(shown,hidden);
    expect(visibleMeshCount(root)).toBe(1);
  });
});
