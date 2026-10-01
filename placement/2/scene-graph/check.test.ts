import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { visibleMeshes, namedMeshes, removeTaggedHelpers, tightWorldSize, uniqueGeometryCount, rendersForCamera, selectableId, swapMaterial, coloredClone } from './check';

describe('scene-graph.traverse', () => {
it('skips every child of a hidden branch but keeps nested visible meshes', () => {
    const root = new THREE.Group();
    const shown = new THREE.Mesh(); shown.name = 'shown';
    const hidden = new THREE.Group(); hidden.visible = false;
    const hiddenMesh = new THREE.Mesh(); hiddenMesh.name = 'hidden'; hidden.add(hiddenMesh);
    const nested = new THREE.Group(); const nestedMesh = new THREE.Mesh(); nestedMesh.name = 'nested'; nested.add(nestedMesh);
    root.add(shown, hidden, nested);
    expect(answered(visibleMeshes(root)).map((mesh) => mesh.name)).toEqual(['shown', 'nested']);
    expect(root.children).toEqual([shown, hidden, nested]);
  });
});

describe('scene-graph.finding-objects', () => {
it('finds duplicate mesh names and ignores a Group with that name', () => {
    const root = new THREE.Group(); const a = new THREE.Mesh(); const b = new THREE.Mesh(); const group = new THREE.Group();
    a.name = b.name = group.name = 'bolt'; b.visible = false; root.add(a, b, group);
    expect(answered(namedMeshes(root, 'bolt'))).toEqual([a, b]);
  });
});

describe('scene-graph.safe-mutation', () => {
it('removes adjacent helpers without skipping the next sibling', () => {
    const root = new THREE.Group(); const helpers = Array.from({ length: 4 }, () => new THREE.Group());
    for (const helper of helpers) { helper.userData.helper = true; root.add(helper); }
    const keep = new THREE.Mesh(); root.add(keep);
    expectNumber(removeTaggedHelpers(root), 4);
    expect(root.children).toEqual([keep]);
  });
});

describe('scene-graph.world-bounds', () => {
it('uses a tight world box under a turned and scaled parent', () => {
    const root = new THREE.Group(); root.position.set(1, 2, -3); root.scale.set(2, 1, 0.5); root.rotation.y = 0.48;
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 3)); mesh.rotation.z = 0.3; root.add(mesh);
    const hidden = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 0.5)); hidden.position.x = 5; hidden.visible = false; root.add(hidden);
    root.updateMatrixWorld(true);
    const expected = new THREE.Box3().setFromObject(root, true).getSize(new THREE.Vector3());
    expectVector(tightWorldSize(root), expected);
    expect(root.position.toArray()).toEqual([1, 2, -3]);
  });
});

describe('scene-graph.scene-stats', () => {
it('counts a shared geometry once, including hidden uses', () => {
    const root = new THREE.Group(); const shared = new THREE.BoxGeometry(); const a = new THREE.Mesh(shared); const b = new THREE.Mesh(shared); b.visible = false;
    root.add(a, b, new THREE.Mesh(new THREE.SphereGeometry()));
    expectNumber(uniqueGeometryCount(root), 2);
  });
});

describe('scene-graph.visibility-layers', () => {
it('checks camera layers on the object and visibility through parents', () => {
    const camera = new THREE.PerspectiveCamera(); camera.layers.set(2);
    const root = new THREE.Group(); const mesh = new THREE.Mesh(); root.add(mesh); mesh.layers.set(2);
    expectExact(rendersForCamera(mesh, camera), true);
    root.visible = false; expectExact(rendersForCamera(mesh, camera), false);
    root.visible = true; mesh.layers.set(1); expectExact(rendersForCamera(mesh, camera), false);
  });
});

describe('scene-graph.user-data', () => {
it('finds metadata on a parent and returns empty for untagged hits', () => {
    const part = new THREE.Group(); part.userData.selectableId = 'left-cup';
    const child = new THREE.Mesh(); part.add(new THREE.Group().add(child));
    expectExact(selectableId(child), 'left-cup');
    expectExact(selectableId(new THREE.Mesh()), '');
  });
});

describe('scene-graph.material-override', () => {
it('returns the exact original material for later restoration', () => {
    const original = new THREE.MeshBasicMaterial({ color: 'blue' }); const replacement = new THREE.MeshBasicMaterial({ color: 'yellow' });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), original);
    const saved = answered(swapMaterial(mesh, replacement));
    expect(saved).toBe(original); expect(mesh.material).toBe(replacement);
    mesh.material = saved as THREE.MeshBasicMaterial; expect(mesh.material).toBe(original);
  });
});

describe('scene-graph.clone-semantics', () => {
it('shares geometry, isolates material, and preserves the original color', () => {
    const geometry = new THREE.BoxGeometry(); const material = new THREE.MeshStandardMaterial({ color: 'blue' });
    const source = new THREE.Mesh(geometry, material); const copy = answered(coloredClone(source, 'red'));
    expect(copy).not.toBe(source); expect(copy.geometry).toBe(geometry); expect(copy.material).not.toBe(material);
    expect((copy.material as THREE.MeshStandardMaterial).color.getHex()).toBe(new THREE.Color('red').getHex());
    expect(material.color.getHex()).toBe(new THREE.Color('blue').getHex());
  });
});
