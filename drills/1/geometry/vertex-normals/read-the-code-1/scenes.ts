// Scenes for the vertex normals page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, overlay, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';
import { mergeVertices, toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';

// Swaps which geometry a mesh draws, and redraws its normals to match.
function normalsView(scene: THREE.Scene, mesh: THREE.Mesh, size: number, color: string) {
  let helper: VertexNormalsHelper | undefined;
  return (geometry: THREE.BufferGeometry) => {
    mesh.geometry = geometry;
    if (helper) {
      scene.remove(helper);
      helper.dispose();
    }
    helper = new VertexNormalsHelper(mesh, size, new THREE.Color(color).getHex());
    scene.add(helper);
  };
}

export const smoothing: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(1.1, 2.0, 2.5);
  controls.target.set(0, 1.2, 0);
  sunlight(scene, new THREE.Vector3(3, 4, 2), 0.35);

  // Every vertex shared, then three ways to give it normals.
  const shared = mergeVertices(new THREE.CylinderGeometry(0.6, 0.6, 1.1, 16).deleteAttribute('normal').deleteAttribute('uv'));
  shared.computeVertexNormals();
  const faceted = shared.toNonIndexed();
  faceted.computeVertexNormals();
  const creased = toCreasedNormals(shared.clone(), THREE.MathUtils.degToRad(30));

  const mesh = new THREE.Mesh(shared, new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  mesh.position.y = 1.0;
  scene.add(mesh);
  const show = normalsView(scene, mesh, 0.25, COLORS.white);

  const readout = overlay(container, 'readout');
  const pick = (geometry: THREE.BufferGeometry, lines: string[]) => {
    show(geometry);
    readout.textContent = [...lines, `position.count ${geometry.attributes.position.count}   index ${geometry.index ? 'yes' : 'none'}`].join('\n');
  };

  choiceButtons(overlay(container, 'controls'), [
    {
      html: 'shared, <code>computeVertexNormals()</code>',
      select: () =>
        pick(shared, [
          'geometry.computeVertexNormals()   // every vertex shared',
          'smooth sides, but the rims are smeared: the top looks domed',
        ]),
    },
    {
      html: '<code>toNonIndexed()</code> first',
      select: () =>
        pick(faceted, [
          'const faceted = geometry.toNonIndexed(); faceted.computeVertexNormals()',
          'every triangle lit on its own: the low-poly look',
        ]),
    },
    {
      html: '<code>toCreasedNormals(geometry, 30°)</code>',
      select: () =>
        pick(creased, [
          'const creased = toCreasedNormals(geometry, MathUtils.degToRad(30))',
          'smooth sides, sharp rims: edges past 30° keep split normals',
        ]),
    },
  ]);
};

export const badImport: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.8, 1.7, 2.7);
  controls.target.set(0, 1.15, 0);
  sunlight(scene, new THREE.Vector3(2, 3, 3), 0.35);

  // As a broken export might deliver it: a patch on the front right has its normals flipped.
  const imported = new THREE.SphereGeometry(0.75, 32, 16);
  const normal = imported.attributes.normal;
  const position = imported.attributes.position;
  for (let i = 0; i < position.count; i++) {
    if (position.getX(i) > 0.15 && position.getY(i) > -0.25 && position.getZ(i) > 0.1) {
      normal.setXYZ(i, -normal.getX(i), -normal.getY(i), -normal.getZ(i));
    }
  }
  const fixed = imported.clone();
  fixed.computeVertexNormals();

  const mesh = new THREE.Mesh(imported, new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  mesh.position.y = 1.1;
  scene.add(mesh);
  const show = normalsView(scene, mesh, 0.12, COLORS.gray);

  // How many normals point into the ball instead of out of it.
  const inward = (geometry: THREE.BufferGeometry) => {
    const p = new THREE.Vector3();
    const n = new THREE.Vector3();
    let count = 0;
    for (let i = 0; i < geometry.attributes.position.count; i++) {
      p.fromBufferAttribute(geometry.attributes.position, i);
      n.fromBufferAttribute(geometry.attributes.normal, i);
      if (n.dot(p) < 0) count++;
    }
    return count;
  };

  const readout = overlay(container, 'readout');
  const pick = (geometry: THREE.BufferGeometry, code: string, result: string) => {
    show(geometry);
    readout.textContent = [code, `normals pointing inward: ${inward(geometry)} of ${geometry.attributes.position.count}`, result].join('\n');
  };

  choiceButtons(overlay(container, 'controls'), [
    {
      html: 'as imported',
      select: () => pick(imported, '// the normals the file came with', 'the patch is lit as if it faced away: dark'),
    },
    {
      html: '<code>geometry.computeVertexNormals()</code>',
      select: () => pick(fixed, 'geometry.computeVertexNormals()', 'worked out again from the corners: evenly lit'),
    },
  ]);
};
