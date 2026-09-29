// Scenes for the draw call reduction page. The README places each one with <div data-scene="name">.
import { buttonGroup, choiceButtons, COLORS, formatBytes, geometryBytes, hideFloorHelpers, overlay, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const WIDTH = 3.2;
const DEPTH = 0.6;
const PLANKS = [0.3, 0.8, 1.3, 1.8];
const BIN_ROWS = PLANKS.slice(0, 3);
const BINS_PER_ROW = 12;

// The rack's steel frame: 16 parts in 4 shapes (posts, planks, front rails, foot plates).
function buildFrame(steel: THREE.Material) {
  const post = new THREE.BoxGeometry(0.06, 2, 0.06);
  const plank = new THREE.BoxGeometry(WIDTH, 0.04, DEPTH);
  const rail = new THREE.BoxGeometry(WIDTH, 0.06, 0.03);
  const foot = new THREE.BoxGeometry(0.16, 0.02, 0.16);
  const frame = new THREE.Group();
  const add = (geometry: THREE.BufferGeometry, x: number, y: number, z: number) => {
    const part = new THREE.Mesh(geometry, steel);
    part.position.set(x, y, z);
    frame.add(part);
  };
  for (const x of [-WIDTH / 2, WIDTH / 2]) {
    for (const z of [-DEPTH / 2, DEPTH / 2]) {
      add(post, x, 1.01, z);
      add(foot, x, 0.02, z);
    }
  }
  for (const y of PLANKS) {
    add(plank, 0, y, 0);
    add(rail, 0, y + 0.02, DEPTH / 2);
  }
  frame.updateMatrixWorld();
  return { frame, shapes: [post, plank, rail, foot] };
}

function binSpots() {
  const spots: THREE.Vector3[] = [];
  for (const y of BIN_ROWS) {
    for (let i = 0; i < BINS_PER_ROW; i++) spots.push(new THREE.Vector3(-1.43 + i * 0.26, y + 0.11, -0.02));
  }
  return spots;
}

export const fixes: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(1.25, 1.55, 3.95);
  controls.target.set(0.2, 0.97, 0);
  hideFloorHelpers(scene);
  sunlight(scene, new THREE.Vector3(3, 5, 4), 0.8, 2);

  const steel = new THREE.MeshStandardMaterial({ color: COLORS.gray, metalness: 0.3, roughness: 0.5 });
  const plastic = new THREE.MeshStandardMaterial({ color: COLORS.blue });

  // The frame three ways: a mesh per part, one merged mesh, and one BatchedMesh.
  const { frame: frameMeshes, shapes } = buildFrame(steel);
  const parts = frameMeshes.children as THREE.Mesh[];
  const frameMerged = new THREE.Mesh(mergeGeometries(parts.map((part) => part.geometry.clone().applyMatrix4(part.matrixWorld))), steel);
  const vertices = shapes.reduce((sum, shape) => sum + shape.attributes.position.count, 0);
  const indices = shapes.reduce((sum, shape) => sum + shape.index!.count, 0);
  const frameBatch = new THREE.BatchedMesh(parts.length, vertices, indices, steel);
  const shapeIds = new Map<THREE.BufferGeometry, number>(shapes.map((shape) => [shape, frameBatch.addGeometry(shape)]));
  for (const part of parts) frameBatch.setMatrixAt(frameBatch.addInstance(shapeIds.get(part.geometry)!), part.matrixWorld);

  // The bins three ways: a mesh per bin, one merged mesh, and one InstancedMesh.
  const binGeometry = new THREE.BoxGeometry(0.22, 0.18, 0.4);
  const spots = binSpots();
  const binMeshes = new THREE.Group();
  for (const spot of spots) {
    const bin = new THREE.Mesh(binGeometry, plastic);
    bin.position.copy(spot);
    binMeshes.add(bin);
  }
  const binsMerged = new THREE.Mesh(mergeGeometries(spots.map((spot) => binGeometry.clone().translate(spot.x, spot.y, spot.z))), plastic);
  const binsInstanced = new THREE.InstancedMesh(binGeometry, plastic, spots.length);
  const matrix = new THREE.Matrix4();
  spots.forEach((spot, i) => binsInstanced.setMatrixAt(i, matrix.makeTranslation(spot)));
  binsInstanced.computeBoundingSphere();

  const frames = [frameMeshes, frameMerged, frameBatch];
  const bins = [binMeshes, binsMerged, binsInstanced];
  scene.add(...frames, ...bins);

  const frameCode = [
    `${parts.length} × new Mesh(partGeometry, steel)`,
    'new Mesh(mergeGeometries(framePieces), steel)',
    `new BatchedMesh(…, steel): ${shapes.length} shapes, ${parts.length} copies`,
  ];
  const binCode = [
    `${spots.length} × new Mesh(binGeometry, plastic)`,
    'new Mesh(mergeGeometries(binPieces), plastic)',
    `new InstancedMesh(binGeometry, plastic, ${spots.length})`,
  ];
  const binBytes = [
    `${formatBytes(geometryBytes(binGeometry))}, one geometry shared by ${spots.length} meshes`,
    `${formatBytes(geometryBytes(binsMerged.geometry))}: ${spots.length} copies of the bin's vertices`,
    `${formatBytes(geometryBytes(binGeometry))}, plus ${formatBytes(binsInstanced.instanceMatrix.array.byteLength)} of matrices`,
  ];
  let frameMode = 0;
  let binMode = 0;
  const show = () => {
    frames.forEach((object, i) => (object.visible = i === frameMode));
    bins.forEach((object, i) => (object.visible = i === binMode));
  };

  const bar = overlay(container, 'controls');
  choiceButtons(
    buttonGroup(bar, 'Frame:'),
    ['a Mesh each', 'merged', 'BatchedMesh'].map((html, i) => ({ html, select: () => ((frameMode = i), show()) })),
  );
  choiceButtons(
    buttonGroup(bar, 'Bins:'),
    ['a Mesh each', 'merged', 'InstancedMesh'].map((html, i) => ({ html, select: () => ((binMode = i), show()) })),
  );

  const readout = overlay(container, 'readout');
  // Runs before each render, so the counts are the last frame's.
  onFrame(() => {
    const { calls, triangles } = renderer.info.render;
    readout.textContent = [
      `frame  ${frameCode[frameMode]}`,
      `bins   ${binCode[binMode]}`,
      `renderer.info.render.calls ${calls} · triangles ${triangles}, whichever tools`,
      `bins' vertex data: ${binBytes[binMode]}`,
    ].join('\n');
  });
};

const PANELS = 12;

export const fillRate: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0.6, 1.3, 2.9);
  controls.target.set(0, 1.2, -1.1);
  hideFloorHelpers(scene);

  // Each panel adds a little light wherever it's drawn, so brightness counts the panels shaded there.
  // The color is set in sRGB, the numbers that reach the canvas and add up there.
  const geometry = new THREE.PlaneGeometry(2, 1.3);
  const glass = new THREE.MeshBasicMaterial({
    color: new THREE.Color().setRGB(0.025, 0.045, 0.075, THREE.SRGBColorSpace),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const spots = Array.from({ length: PANELS }, (_, i) => new THREE.Vector3(((i % 4) - 1.5) * 0.45, 1.2 + (Math.floor(i / 4) - 1) * 0.3, -i * 0.2));

  const meshes = new THREE.Group();
  for (const spot of spots) {
    const panel = new THREE.Mesh(geometry, glass);
    panel.position.copy(spot);
    meshes.add(panel);
  }
  const instanced = new THREE.InstancedMesh(geometry, glass, PANELS);
  const matrix = new THREE.Matrix4();
  spots.forEach((spot, i) => instanced.setMatrixAt(i, matrix.makeTranslation(spot)));
  instanced.computeBoundingSphere();
  scene.add(meshes, instanced);

  let useInstanced = false;
  choiceButtons(overlay(container, 'controls'), [
    { html: `${PANELS} × <code>new Mesh(panel, glass)</code>`, select: () => ((useInstanced = false), (meshes.visible = true), (instanced.visible = false)) },
    { html: `<code>new InstancedMesh(panel, glass, ${PANELS})</code>`, select: () => ((useInstanced = true), (meshes.visible = false), (instanced.visible = true)) },
  ]);

  const raycaster = new THREE.Raycaster();
  const center = new THREE.Vector2(0, 0);
  const hits: THREE.Intersection[] = [];
  const readout = overlay(container, 'readout');
  // Runs before each render, so the draw calls are the last frame's.
  onFrame(() => {
    // A ray through the middle of the view crosses every panel that covers the center pixel.
    raycaster.setFromCamera(center, camera);
    hits.length = 0;
    raycaster.intersectObject(useInstanced ? instanced : meshes, true, hits);
    readout.textContent = [
      useInstanced ? `one InstancedMesh of ${PANELS} panels` : `${PANELS} separate meshes`,
      `renderer.info.render.calls  ${renderer.info.render.calls}`,
      `panels covering the center pixel: ${hits.length}, each one shaded there`,
      'the brightness is the pixel work: the same either way',
    ].join('\n');
  });
};
