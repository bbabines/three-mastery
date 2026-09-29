// Scenes for the object types tour. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, label, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Three racks side by side, each with four posts and five shelves, and a few bins on the shelves.
const RACK_X = [-1.35, 0, 1.35];
const SHELF_Y = [0.25, 0.65, 1.05, 1.45, 1.85];
const BIN_SPOTS: [number, number][] = [
  [-1.6, 0.65],
  [-1.1, 1.45],
  [-0.2, 0.25],
  [0.25, 1.05],
  [1.2, 1.85],
  [1.55, 0.65],
];

const at = (x: number, y: number, z = 0) => new THREE.Matrix4().makeTranslation(x, y, z);

function rackParts() {
  const shelf = new THREE.BoxGeometry(1.2, 0.05, 0.5);
  const post = new THREE.BoxGeometry(0.05, 2, 0.05);
  const bin = new THREE.BoxGeometry(0.3, 0.2, 0.3);
  const shelves = RACK_X.flatMap((x) => SHELF_Y.map((y) => at(x, y)));
  const posts = RACK_X.flatMap((x) => [-0.575, 0.575].flatMap((dx) => [-0.22, 0.22].map((z) => at(x + dx, 1, z))));
  const bins = BIN_SPOTS.map(([x, y]) => at(x, y + 0.125));
  return { shelf, post, bin, shelves, posts, bins };
}

export const members: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0.9, 1.7, 4.3);
  controls.target.set(0, 0.95, 0);

  // The grid and axes are lines too, so they'd add two draw calls to every count.
  for (const child of scene.children) {
    if (child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper) child.visible = false;
  }

  const { shelf, post, bin, shelves, posts, bins } = rackParts();
  const material = new THREE.MeshStandardMaterial({ color: COLORS.orange });
  const partCount = shelves.length + posts.length + bins.length;

  // Mesh: every part merged into one geometry.
  const rackGeometry = mergeGeometries([
    ...shelves.map((m) => shelf.clone().applyMatrix4(m)),
    ...posts.map((m) => post.clone().applyMatrix4(m)),
    ...bins.map((m) => bin.clone().applyMatrix4(m)),
  ]);
  const mesh = new THREE.Mesh(rackGeometry, material);

  // InstancedMesh: 15 copies of one shelf.
  const instanced = new THREE.InstancedMesh(shelf, material, shelves.length);
  shelves.forEach((m, i) => instanced.setMatrixAt(i, m));

  // BatchedMesh: three different shapes, one material.
  const vertexTotal = [shelf, post, bin].reduce((sum, g) => sum + g.attributes.position.count, 0);
  const indexTotal = [shelf, post, bin].reduce((sum, g) => sum + g.index!.count, 0);
  const batch = new THREE.BatchedMesh(partCount, vertexTotal, indexTotal, material);
  const [shelfId, postId, binId] = [shelf, post, bin].map((g) => batch.addGeometry(g));
  for (const [id, matrices] of [
    [shelfId, shelves],
    [postId, posts],
    [binId, bins],
  ] as const) {
    for (const m of matrices) batch.setMatrixAt(batch.addInstance(id), m);
  }

  // Points: a scan, sampled from the rack's surfaces.
  const sampler = new MeshSurfaceSampler(mesh).build();
  const scanPositions: number[] = [];
  const sample = new THREE.Vector3();
  for (let i = 0; i < 6000; i++) {
    sampler.sample(sample);
    scanPositions.push(sample.x, sample.y, sample.z);
  }
  const scanGeometry = new THREE.BufferGeometry();
  scanGeometry.setAttribute('position', new THREE.Float32BufferAttribute(scanPositions, 3));
  const points = new THREE.Points(scanGeometry, new THREE.PointsMaterial({ color: COLORS.white, size: 0.02 }));

  // Line and LineSegments: the rack's edges, and a height dimension line beside the right rack.
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(rackGeometry), new THREE.LineBasicMaterial({ color: COLORS.white }));
  const x = 2.25;
  const [bottom, top] = [0, 2];
  const dimension = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(
      [
        [x - 0.1, bottom],
        [x + 0.1, bottom],
        [x, bottom],
        [x, top],
        [x - 0.1, top],
        [x + 0.1, top],
      ].map(([px, py]) => new THREE.Vector3(px, py, 0.25)),
    ),
    new THREE.LineBasicMaterial({ color: COLORS.yellow, linewidth: 4 }),
  );
  const lines = new THREE.Group();
  lines.add(edges, dimension);

  // Sprite: one tag per rack.
  const sprites = new THREE.Group();
  ['A', 'B', 'C'].forEach((name, i) => {
    const tag = label(`rack ${name}`, COLORS.yellow);
    tag.position.set(RACK_X[i], 1.1, 0);
    sprites.add(tag);
  });

  // Group: every part as its own Mesh.
  const group = new THREE.Group();
  for (const [geometry, matrices] of [
    [shelf, shelves],
    [post, posts],
    [bin, bins],
  ] as const) {
    for (const m of matrices) {
      const part = new THREE.Mesh(geometry, material);
      part.applyMatrix4(m);
      group.add(part);
    }
  }

  const readout = overlay(container, 'readout');
  const buttons = overlay(container, 'controls');
  const types: { name: string; object: THREE.Object3D; code: string; draws: string }[] = [
    { name: 'Mesh', object: mesh, code: 'new Mesh(rackGeometry, material)', draws: `one geometry holding all ${partCount} parts` },
    {
      name: 'InstancedMesh',
      object: instanced,
      code: `new InstancedMesh(shelfGeometry, material, ${shelves.length})`,
      draws: `${shelves.length} copies of one shelf`,
    },
    {
      name: 'BatchedMesh',
      object: batch,
      code: 'batch.addGeometry(shelf), (post), (bin), then addInstance',
      draws: `3 different shapes, ${partCount} copies, one material`,
    },
    {
      name: 'Points',
      object: points,
      code: 'new Points(scanGeometry, new PointsMaterial({ size: 0.02 }))',
      draws: `a dot at each of ${scanPositions.length / 3} points`,
    },
    {
      name: 'Line, LineSegments',
      object: lines,
      code: 'new LineSegments(edgesGeometry), new Line(dimensionPoints)\n       material: new LineBasicMaterial({ linewidth: 4 })',
      draws: 'the edges, and a height line: 1 pixel wide anyway',
    },
    { name: 'Sprite', object: sprites, code: "new Sprite(new SpriteMaterial({ map: tagTexture }))", draws: '3 tags that turn to face you' },
    { name: 'Group', object: group, code: 'rack.add(part) for each part', draws: `nothing itself; holds ${partCount} separate meshes` },
  ];
  for (const type of types) {
    type.object.visible = false;
    scene.add(type.object);
  }

  let selected = types[0];
  choiceButtons(
    buttons,
    types.map((type) => ({
      html: type.name,
      select: () => {
        for (const other of types) other.object.visible = other === type;
        selected = type;
      },
    })),
  );

  // Runs before each render, so the count is from the frame that was just drawn.
  onFrame(() => {
    readout.textContent = [
      `code   ${selected.code}`,
      `draws  ${selected.draws}`,
      `renderer.info.render.calls  ${renderer.info.render.calls}`,
    ].join('\n');
  });
};
