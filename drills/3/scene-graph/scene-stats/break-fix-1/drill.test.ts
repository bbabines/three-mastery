import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { visibleLayerMeshes } from './drill';

describe('scene-graph.scene-stats', () => {
  it('repairs the reported symptom for a general case', () => {
    const root=new THREE.Group(), a=new THREE.Mesh(), b=new THREE.Mesh(), c=new THREE.Mesh(), hidden=new THREE.Group();
    b.layers.set(2); c.visible=false; hidden.visible=false;
    const child=new THREE.Mesh(); child.layers.set(2); hidden.add(child);
    root.add(a,b,c,hidden);
    expect(visibleLayerMeshes(root,2)).toBe(1);
    expect(visibleLayerMeshes(root,0)).toBe(1);
  });
});
