import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { findSku } from './drill';

describe('scene-graph.finding-objects', () => {
  it('repairs the reported symptom for a general case', () => {
    const root=new THREE.Group(), nested=new THREE.Group(), part=new THREE.Mesh(); part.name="Imported_Mesh_1"; part.userData.sku="RACK-42"; nested.add(part); root.add(nested);
    expect(findSku(root,"RACK-42")).toBe(part); expect(findSku(root,"missing")).toBeNull();
  });
});
