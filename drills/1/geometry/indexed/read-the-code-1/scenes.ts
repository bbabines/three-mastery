// Scenes for the indexed vs non-indexed page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, label, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';
import { estimateBytesUsed, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

export const shareCorners: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.4, 1.35, 3.4);
  controls.target.set(0, 1.15, 0);

  // A panel standing up, its bottom edge clear of the floor grid.
  const holder = new THREE.Group();
  holder.position.y = 1.05;
  scene.add(holder);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let segments = 2;
  let indexed = true;

  const update = () => {
    holder.clear();
    const grid = new THREE.PlaneGeometry(2.8, 1.5, segments, segments);
    const geometry = indexed ? grid : grid.toNonIndexed();
    const position = geometry.attributes.position;
    holder.add(
      new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: '#1e3a5f', side: THREE.DoubleSide })),
      new THREE.LineSegments(new THREE.WireframeGeometry(geometry), new THREE.LineBasicMaterial({ color: COLORS.gray })),
    );

    // How many vertices sit at each point of the grid.
    const copies = new Map<string, { at: THREE.Vector3; count: number }>();
    const corner = new THREE.Vector3();
    for (let i = 0; i < position.count; i++) {
      corner.fromBufferAttribute(position, i);
      const key = `${corner.x.toFixed(3)},${corner.y.toFixed(3)}`;
      const entry = copies.get(key) ?? { at: corner.clone(), count: 0 };
      entry.count += 1;
      copies.set(key, entry);
    }
    for (const { at, count } of copies.values()) {
      const tag = label(String(count), COLORS.yellow);
      tag.position.copy(at).add(new THREE.Vector3(0.1, 0.1, 0.02));
      tag.scale.multiplyScalar(0.75);
      holder.add(tag);
    }

    const triangles = (geometry.index ? geometry.index.count : position.count) / 3;
    readout.textContent = [
      indexed
        ? `new PlaneGeometry(2.8, 1.5, ${segments}, ${segments})`
        : `new PlaneGeometry(2.8, 1.5, ${segments}, ${segments}).toNonIndexed()`,
      `position.count ${position.count}   index ${geometry.index ? `count ${geometry.index.count}` : 'null'}   triangles ${triangles}`,
      geometry.index
        ? `memory  ${position.count} × 32 + ${geometry.index.count} × 2 bytes = ${estimateBytesUsed(geometry)} bytes`
        : `memory  ${position.count} × 32 bytes = ${estimateBytesUsed(geometry)} bytes, no index`,
    ].join('\n');
  };

  choiceButtons(controlsBar, [
    {
      html: 'indexed',
      select: () => {
        indexed = true;
        update();
      },
    },
    {
      html: '<code>toNonIndexed()</code>',
      select: () => {
        indexed = false;
        update();
      },
    },
  ]);
  slider(controlsBar, 'grid size', { min: 1, max: 4, step: 1, value: segments }, (value) => {
    segments = value;
    update();
  });
};

export const hardEdges: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.2, 1.9, 3.3);
  controls.target.set(0, 1.3, 0);

  // Its own light from the upper right, so each face's shading shows.
  const sky = scene.children.find((child): child is THREE.HemisphereLight => child instanceof THREE.HemisphereLight);
  if (sky) sky.intensity = 0.4;
  const sun = new THREE.DirectionalLight(0xffffff, 2.5);
  sun.position.set(3, 4, 5);
  scene.add(sun);

  const box = new THREE.BoxGeometry(1.1, 1.1, 1.1);
  const merged = mergeVertices(new THREE.BoxGeometry(1.1, 1.1, 1.1).deleteAttribute('normal').deleteAttribute('uv'));
  merged.computeVertexNormals();
  const split = box.toNonIndexed();

  const mesh = new THREE.Mesh<THREE.BufferGeometry, THREE.Material>(box, new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  mesh.position.set(0, 1.2, 0);
  mesh.rotation.set(0.35, -0.6, 0);
  scene.add(mesh);
  let normals: VertexNormalsHelper | undefined;

  const readout = overlay(container, 'readout');
  const show = (geometry: THREE.BufferGeometry, code: string, perCorner: string) => {
    mesh.geometry = geometry;
    if (normals) {
      scene.remove(normals);
      normals.dispose();
    }
    normals = new VertexNormalsHelper(mesh, 0.35, new THREE.Color(COLORS.white).getHex());
    scene.add(normals);
    readout.textContent = [
      code,
      `position.count ${geometry.attributes.position.count}   index ${geometry.index ? `count ${geometry.index.count}` : 'null'}`,
      perCorner,
    ].join('\n');
  };

  choiceButtons(overlay(container, 'controls'), [
    {
      html: '<code>new BoxGeometry()</code>',
      select: () => show(box, 'new BoxGeometry(1.1, 1.1, 1.1)', '3 vertices at each corner, one per face: sharp edges'),
    },
    {
      html: '<code>mergeVertices(…)</code>',
      select: () =>
        show(
          merged,
          "const merged = mergeVertices(box.deleteAttribute('normal').deleteAttribute('uv'))\nmerged.computeVertexNormals()",
          '1 vertex at each corner, so 1 normal: shaded like a ball',
        ),
    },
    {
      html: '<code>toNonIndexed()</code>',
      select: () => show(split, 'new BoxGeometry(1.1, 1.1, 1.1).toNonIndexed()', 'a copy for every triangle at each corner: sharp edges'),
    },
  ]);
};
