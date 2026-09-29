// Scenes for the BVH page. The README places each one with <div data-scene="name">.
//
// three.js has no BVH, and three-mesh-bvh isn't installed, so these scenes build a small one from
// three.js's own pieces: Box3s over halves of the triangles, split again and again. The box and
// triangle tests are three.js's `ray.intersectsBox` and `ray.intersectTriangle`.
import { ball, choiceButtons, COLORS, formatVector, line, overlay, pointer, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const LEAF_SIZE = 16; // split until a box holds this many triangles or fewer

interface TreeNode {
  box: THREE.Box3;
  start: number; // this node's triangles are order[start] up to order[start + count - 1]
  count: number;
  children?: [TreeNode, TreeNode];
}

interface Tree {
  root: TreeNode;
  order: Uint32Array; // triangle numbers, sorted so each node's triangles sit together
  boxes: number;
  levels: number;
}

const corner = new THREE.Vector3();

// Measures a box around the triangles order[start ... start + count - 1], as they are now.
function fitBox(box: THREE.Box3, positions: ArrayLike<number>, order: Uint32Array, start: number, count: number) {
  box.makeEmpty();
  for (let i = start; i < start + count; i++) {
    for (let k = 0; k < 3; k++) box.expandByPoint(corner.fromArray(positions, order[i] * 9 + k * 3));
  }
}

function buildTree(positions: ArrayLike<number>): Tree {
  const triangles = positions.length / 9;
  const order = new Uint32Array(triangles).map((_, i) => i);
  const middles = new Float32Array(triangles * 3); // each triangle's middle, for sorting
  for (let t = 0; t < triangles; t++) {
    for (let axis = 0; axis < 3; axis++) {
      middles[t * 3 + axis] = (positions[t * 9 + axis] + positions[t * 9 + 3 + axis] + positions[t * 9 + 6 + axis]) / 3;
    }
  }
  let boxes = 0;
  let levels = 0;
  const build = (start: number, count: number, level: number): TreeNode => {
    boxes += 1;
    levels = Math.max(levels, level);
    const node: TreeNode = { box: new THREE.Box3(), start, count };
    fitBox(node.box, positions, order, start, count);
    if (count <= LEAF_SIZE) return node;
    // Split across the box's longest side: sort by where each triangle's middle is along it.
    const size = node.box.getSize(new THREE.Vector3());
    const axis = size.x >= size.y && size.x >= size.z ? 0 : size.y >= size.z ? 1 : 2;
    order.subarray(start, start + count).sort((a, b) => middles[a * 3 + axis] - middles[b * 3 + axis]);
    const half = Math.floor(count / 2);
    node.children = [build(start, half, level + 1), build(start + half, count - half, level + 1)];
    return node;
  };
  const root = build(0, triangles, 1);
  return { root, order, boxes, levels };
}

// Re-measures every box around the triangles already in it, bottom up, without sorting again.
function refit(node: TreeNode, positions: ArrayLike<number>, order: Uint32Array) {
  if (!node.children) {
    fitBox(node.box, positions, order, node.start, node.count);
    return;
  }
  refit(node.children[0], positions, order);
  refit(node.children[1], positions, order);
  node.box.copy(node.children[0].box).union(node.children[1].box);
}

const a = new THREE.Vector3();
const b = new THREE.Vector3();
const c = new THREE.Vector3();
const found = new THREE.Vector3();

// Walks the tree with the ray: box tests all the way down, triangle tests only in the boxes it reaches.
// `backfaceCulling` matches the material: true for FrontSide, false for DoubleSide.
function queryTree(tree: Tree, positions: ArrayLike<number>, ray: THREE.Ray, backfaceCulling: boolean) {
  const stats = { boxTests: 0, triangleTests: 0, leaves: [] as THREE.Box3[], nearest: null as THREE.Vector3 | null };
  let nearestDistance = Infinity;
  const visit = (node: TreeNode) => {
    stats.boxTests += 1;
    if (!ray.intersectsBox(node.box)) return; // misses the box: skip everything inside
    if (node.children) {
      visit(node.children[0]);
      visit(node.children[1]);
      return;
    }
    stats.leaves.push(node.box);
    for (let i = node.start; i < node.start + node.count; i++) {
      const t = tree.order[i] * 9;
      stats.triangleTests += 1;
      a.fromArray(positions, t);
      b.fromArray(positions, t + 3);
      c.fromArray(positions, t + 6);
      if (ray.intersectTriangle(a, b, c, backfaceCulling, found)) {
        const distance = ray.origin.distanceTo(found);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          stats.nearest = found.clone();
        }
      }
    }
  };
  visit(tree.root);
  return stats;
}

const EDGES = [0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7];

// The edges of many boxes as one set of lines, redrawn by set().
function boxLines(color: string, opacity = 1) {
  const lines = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity }));
  lines.frustumCulled = false;
  const set = (boxes: THREE.Box3[]) => {
    const points: number[] = [];
    for (const { min: n, max: x } of boxes) {
      const corners = [
        [n.x, n.y, n.z], [x.x, n.y, n.z], [x.x, x.y, n.z], [n.x, x.y, n.z],
        [n.x, n.y, x.z], [x.x, n.y, x.z], [x.x, x.y, x.z], [n.x, x.y, x.z],
      ];
      for (const index of EDGES) points.push(...corners[index]);
    }
    lines.geometry.dispose();
    lines.geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  };
  return { lines, set };
}

const count = (n: number) => n.toLocaleString('en-US');
const DETAIL = [8, 32, 128, 512]; // the knot's segments along its length: 192 to 12,288 triangles

export const boxesInBoxes: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2.3, 3, 5);
  controls.target.set(-0.4, 1.6, 0);

  const material = new THREE.MeshStandardMaterial({ color: '#7c8aa5', flatShading: true });
  const knot = new THREE.Mesh(new THREE.BufferGeometry(), material);
  const tested = boxLines(COLORS.yellow);
  const scannerAt = new THREE.Vector3(-3, 2.2, 2.4);
  const scanner = pointer(COLORS.red, 0.5);
  scanner.position.copy(scannerAt);
  const ray = line(COLORS.red);
  const hitMark = ball(COLORS.white, 1, 0.06);
  scene.add(knot, tested.lines, scanner, ray, hitMark);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  const raycaster = new THREE.Raycaster();
  const values = { across: 0, up: 0, detail: 3 };
  let tree: Tree;

  const rebuild = () => {
    // The knot's vertices are placed straight in the world (the mesh isn't moved), so the tree,
    // the ray, and the triangles all share one space.
    const geometry = new THREE.TorusKnotGeometry(0.9, 0.3, DETAIL[values.detail - 1], 12).toNonIndexed().translate(0, 1.5, 0);
    knot.geometry.dispose();
    knot.geometry = geometry;
    tree = buildTree(geometry.attributes.position.array);
  };

  const update = () => {
    const target = new THREE.Vector3(values.across, 1.5 + values.up, 0);
    scanner.lookAt(target);
    raycaster.set(scannerAt, target.sub(scannerAt).normalize());
    const positions = knot.geometry.attributes.position.array;
    const stats = queryTree(tree, positions, raycaster.ray, true);
    const plain = raycaster.intersectObject(knot)[0]; // three.js on its own: every triangle
    const triangles = positions.length / 9;

    tested.set(stats.leaves);
    setLine(ray, scannerAt, stats.nearest ?? raycaster.ray.at(7, new THREE.Vector3()));
    hitMark.visible = !!stats.nearest;
    if (stats.nearest) hitMark.position.copy(stats.nearest);
    const same = plain && stats.nearest ? plain.point.distanceTo(stats.nearest) < 1e-6 : !plain && !stats.nearest;
    readout.textContent = [
      `${count(triangles)} triangles · tree ${tree.levels} levels deep, ${count(tree.boxes)} boxes`,
      `without a BVH: ${count(triangles)} triangle tests`,
      `with one: ${count(stats.boxTests)} box tests + ${count(stats.triangleTests)} triangle tests`,
      stats.nearest
        ? `hit at ${formatVector(stats.nearest, 2)}${same ? ', the same as raycaster.intersectObject' : ''}`
        : `no hit${same ? ', the same as raycaster.intersectObject' : ''}`,
    ].join('\n');
  };

  slider(sliders, 'Aim across', { min: -1.6, max: 1.6, step: 0.05, value: values.across }, (value) => {
    values.across = value;
    update();
  });
  slider(sliders, 'Aim up', { min: -1.2, max: 1.2, step: 0.05, value: values.up }, (value) => {
    values.up = value;
    update();
  });
  slider(sliders, 'Detail', { min: 1, max: 4, step: 1, value: values.detail }, (value) => {
    values.detail = value;
    rebuild();
    update();
  });
  rebuild();
  update();
};

// Pushes a round bump out of the sheet, toward +Z, around its middle.
function bumpHeight(x: number, y: number) {
  const d = Math.hypot(x, y - 1.2);
  return d < 0.75 ? 0.8 * (0.5 + 0.5 * Math.cos((Math.PI * d) / 0.75)) : 0;
}

export const staleBoxes: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 2.4, 3.4);
  controls.target.set(-0.2, 1.3, 0.2);

  // A sheet standing on edge, facing +Z, with its vertices placed straight in the world.
  const geometry = new THREE.PlaneGeometry(3.2, 1.6, 32, 16).toNonIndexed().translate(0, 1.2, 0);
  const flat = Float32Array.from(geometry.attributes.position.array);
  const sheet = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: '#7c8aa5', flatShading: true, side: THREE.DoubleSide }));
  const tree = buildTree(flat);
  const leaves: THREE.Box3[] = [];
  const collect = (node: TreeNode) => (node.children ? node.children.forEach(collect) : leaves.push(node.box));
  collect(tree.root);
  const drawn = boxLines(COLORS.yellow, 0.7);

  // A ray running across in front of the sheet, level with the bump's middle.
  const start = new THREE.Vector3(-2.6, 1.2, 0.45);
  const scanner = pointer(COLORS.red, 0.5);
  scanner.position.copy(start);
  scanner.lookAt(start.clone().add(new THREE.Vector3(1, 0, 0)));
  const ray = line(COLORS.red);
  const hitMark = ball(COLORS.white, 1, 0.06);
  scene.add(sheet, drawn.lines, scanner, ray, hitMark);

  const readout = overlay(container, 'readout');
  const raycaster = new THREE.Raycaster(start, new THREE.Vector3(1, 0, 0));
  const position = geometry.attributes.position as THREE.BufferAttribute;

  const show = (bumped: boolean, refitted: boolean) => {
    for (let i = 0; i < position.count; i++) {
      position.setZ(i, bumped ? bumpHeight(flat[i * 3], flat[i * 3 + 1]) : 0);
    }
    position.needsUpdate = true;
    geometry.computeBoundingSphere(); // three.js's own bounds go stale after an edit too
    geometry.computeVertexNormals();
    if (refitted || !bumped) refit(tree.root, position.array, tree.order);
    else refit(tree.root, flat, tree.order); // the boxes as they were built, around the flat sheet
    drawn.set(leaves);

    const plain = raycaster.intersectObject(sheet)[0];
    const stats = queryTree(tree, position.array, raycaster.ray, false);
    setLine(ray, start, plain ? plain.point : raycaster.ray.at(5.2, new THREE.Vector3()));
    hitMark.visible = !!plain;
    if (plain) hitMark.position.copy(plain.point);
    readout.textContent = [
      !bumped ? 'flat sheet, tree just built' : refitted ? 'bumped sheet, boxes refit' : 'bumped sheet, boxes still from the flat sheet',
      `raycaster.intersectObject(sheet) → ${plain ? `a hit at ${formatVector(plain.point, 2)}` : 'no hit'}`,
      `through the tree → ${
        stats.nearest ? `a hit at ${formatVector(stats.nearest, 2)}` : plain ? 'no hit: the boxes miss the bump' : 'no hit'
      }`,
      `refit: re-measures ${count(tree.boxes)} boxes; a rebuild would sort ${count(tree.order.length)} triangles again`,
    ].join('\n');
  };

  choiceButtons(overlay(container, 'controls'), [
    { html: 'Flat sheet, fresh tree', select: () => show(false, false) },
    { html: 'Push out a bump', select: () => show(true, false) },
    { html: 'Refit the boxes', select: () => show(true, true) },
  ]);
};
