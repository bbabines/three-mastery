import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { findSku } from './drill';

describe('scene-graph.finding-objects', () => {
  it('repairs the reported symptom for a general case', () => {
    const root=new THREE.Group(), nested=new THREE.Group(), decoy=new THREE.Mesh(), part=new THREE.Mesh();
    decoy.name=part.name="Imported_Mesh_1";
    decoy.userData.sku="RACK-41"; part.userData.sku="RACK-42";
    nested.add(part); root.add(decoy,nested);
    expect(findSku(root,"RACK-42")).toBe(part);
    expect(findSku(root,"RACK-41")).toBe(decoy);
    expect(findSku(root,"missing")).toBeNull();
  });
});
