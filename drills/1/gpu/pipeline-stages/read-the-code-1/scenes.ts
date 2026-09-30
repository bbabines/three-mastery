// Scenes for the pipeline stages page. The README places each one with <div data-scene="name">.
import { ball, COLORS, formatNumber, label, overlay, slider, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

function hideFloorHelpers(scene: THREE.Scene) {
  for (const child of scene.children) {
    if (child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper) child.visible = false;
  }
}

const COLS = 24;
const ROWS = 14;
const CELL = 0.25; // one pixel of the tiny screen, in world units
const LEFT = -(COLS * CELL) / 2;
const BOTTOM = 0.3;

// A spot on the tiny screen, in pixels from its bottom-left corner, placed in the world.
const toWorld = (x: number, y: number, z = 0) => new THREE.Vector3(LEFT + x * CELL, BOTTOM + y * CELL, z);

const FAR = [new THREE.Vector3(9, 1.5, 0), new THREE.Vector3(22.5, 3, 0), new THREE.Vector3(15, 12.5, 0)];
const NEAR = [new THREE.Vector3(0.5, 2.5, 0), new THREE.Vector3(10, 5, 0), new THREE.Vector3(3.5, 12, 0)];

export const raster: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 2.45, 5.8);
  controls.target.set(0, 2.45, 0);
  hideFloorHelpers(scene);

  // The screen's pixels live in a tiny texture, one texel per pixel, drawn without smoothing.
  const data = new Uint8Array(COLS * ROWS * 4);
  const texture = new THREE.DataTexture(data, COLS, ROWS);
  texture.magFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(COLS * CELL, ROWS * CELL), new THREE.MeshBasicMaterial({ map: texture }));
  screen.position.copy(toWorld(COLS / 2, ROWS / 2));

  // Pixel borders, so each cell reads as one pixel.
  const borders: THREE.Vector3[] = [];
  for (let i = 0; i <= COLS; i++) borders.push(toWorld(i, 0, 0.01), toWorld(i, ROWS, 0.01));
  for (let j = 0; j <= ROWS; j++) borders.push(toWorld(0, j, 0.01), toWorld(COLS, j, 0.01));
  const grid = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(borders),
    new THREE.LineBasicMaterial({ color: '#0b0c10' }),
  );

  const outline = (color: string) => {
    const lineLoop = new THREE.LineLoop(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: COLORS.white }));
    const corners = [0, 1, 2].map(() => ball(color, 1, 0.07));
    return { lineLoop, corners };
  };
  const far = outline(COLORS.orange);
  const near = outline(COLORS.blue);
  const farTag = label('far', COLORS.orange);
  const nearTag = label('near', COLORS.blue);
  scene.add(screen, grid, far.lineLoop, near.lineLoop, ...far.corners, ...near.corners, farTag, nearTag);

  // Each color as the four 0–255 bytes the texture holds: a '#rrggbb' string's own numbers, which
  // are sRGB already.
  const bytes = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).concat(255);
  const colors = {
    empty: bytes('#23262e'),
    far: bytes(COLORS.orange),
    near: bytes(COLORS.blue),
    lost: bytes('#bfdbfe'), // a blue pixel where an orange fragment was thrown away
  };
  const farTriangle = new THREE.Triangle(...FAR);
  const nearTriangle = new THREE.Triangle();
  const center = new THREE.Vector3();
  const readout = overlay(container, 'readout');

  const update = (shift: number) => {
    const nearCorners = NEAR.map((corner) => corner.clone().setX(corner.x + shift));
    nearTriangle.set(nearCorners[0], nearCorners[1], nearCorners[2]);
    for (const [shape, corners] of [
      [far, FAR],
      [near, nearCorners],
    ] as const) {
      shape.lineLoop.geometry.setFromPoints(corners.map((corner) => toWorld(corner.x, corner.y, 0.03)));
      shape.corners.forEach((dot, i) => dot.position.copy(toWorld(corners[i].x, corners[i].y, 0.05)));
    }
    farTag.position.copy(toWorld(FAR[2].x, FAR[2].y + 1.3, 0.05));
    nearTag.position.copy(toWorld(nearCorners[2].x, nearCorners[2].y + 1.3, 0.05));

    let farFragments = 0;
    let nearFragments = 0;
    let pixels = 0;
    for (let j = 0; j < ROWS; j++) {
      for (let i = 0; i < COLS; i++) {
        center.set(i + 0.5, j + 0.5, 0); // a pixel is covered when its center is inside
        const inFar = farTriangle.containsPoint(center);
        const inNear = nearTriangle.containsPoint(center);
        farFragments += Number(inFar);
        nearFragments += Number(inNear);
        pixels += Number(inFar || inNear);
        const color = inNear && inFar ? colors.lost : inNear ? colors.near : inFar ? colors.far : colors.empty;
        data.set(color, (j * COLS + i) * 4);
      }
    }
    texture.needsUpdate = true;
    const fragments = farFragments + nearFragments;
    readout.textContent = [
      `vertex shader runs     6`,
      `fragment shader runs   ${String(fragments).padEnd(4)} (orange ${farFragments} + blue ${nearFragments})`,
      `pixels colored         ${pixels}`,
      `fragments lost         ${String(fragments - pixels).padEnd(4)} (light blue: orange ones covered)`,
    ].join('\n');
  };
  slider(overlay(container, 'controls'), 'move near triangle', { min: 0, max: 13, step: 0.5, value: 7 }, update);
  update(7);
};

const DETAIL = [8, 16, 32, 64, 128, 256, 512];
const SIZES = [0.05, 0.1, 0.25, 0.5, 1, 1.4];
const BALL_Y = 1.6;

export const work: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0, 1.9, 5.2);
  controls.target.set(0, 1.55, 0);
  hideFloorHelpers(scene);
  sunlight(scene, new THREE.Vector3(3, 5, 4), 0.5, 2.5);

  const material = new THREE.MeshStandardMaterial({ color: COLORS.orange, flatShading: true });
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), material);
  sphere.position.y = BALL_Y;
  scene.add(sphere);

  // Counting covered pixels: the same ball, drawn white on black into an offscreen picture the size
  // of the canvas, then read back and counted. Only redone when something changed.
  const counter = new THREE.Scene();
  counter.background = new THREE.Color(0x000000);
  const silhouette = new THREE.Mesh(sphere.geometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
  counter.add(silhouette);
  const target = new THREE.WebGLRenderTarget(1, 1);
  const size = new THREE.Vector2();
  let pixels: Uint8Array = new Uint8Array(4);
  let covered = 0;
  let dirty = true;
  let framesSinceCount = 0;
  const lastView = new THREE.Matrix4();

  let detail = 64;
  let scale = 1;
  const rebuild = () => {
    sphere.geometry.dispose();
    sphere.geometry = new THREE.SphereGeometry(1, detail, detail / 2);
    silhouette.geometry = sphere.geometry;
    sphere.scale.setScalar(scale);
    dirty = true;
  };

  const sliders = overlay(container, 'controls');
  slider(sliders, 'detail', { min: 0, max: DETAIL.length - 1, step: 1, value: DETAIL.indexOf(detail) }, (value) => {
    detail = DETAIL[value];
    rebuild();
  });
  slider(sliders, 'size on screen', { min: 0, max: SIZES.length - 1, step: 1, value: SIZES.indexOf(scale) }, (value) => {
    scale = SIZES[value];
    rebuild();
  });

  const readout = overlay(container, 'readout');
  onFrame(() => {
    if (!lastView.equals(camera.matrixWorld)) {
      lastView.copy(camera.matrixWorld);
      dirty = true;
    }
    renderer.getDrawingBufferSize(size);
    if (target.width !== size.x || target.height !== size.y) {
      target.setSize(size.x, size.y);
      pixels = new Uint8Array(size.x * size.y * 4);
      dirty = true;
    }
    framesSinceCount += 1;
    if (dirty && framesSinceCount >= 6) {
      // Reading the picture back makes the CPU wait for the GPU, so it's done now and then, not every frame.
      dirty = false;
      framesSinceCount = 0;
      silhouette.position.copy(sphere.position);
      silhouette.scale.copy(sphere.scale);
      renderer.setRenderTarget(target);
      renderer.render(counter, camera);
      renderer.readRenderTargetPixels(target, 0, 0, size.x, size.y, pixels);
      renderer.setRenderTarget(null);
      covered = 0;
      for (let i = 0; i < pixels.length; i += 4) covered += Number(pixels[i] > 127);
    }
    const vertices = sphere.geometry.attributes.position.count;
    readout.textContent = [
      `new SphereGeometry(1, ${detail}, ${detail / 2})   ball.scale.setScalar(${scale})`,
      `vertex shader:    about ${vertices.toLocaleString('en-US')} runs, one per vertex`,
      `fragment shader:  about ${covered.toLocaleString('en-US')} runs, one per pixel covered`,
      `canvas:           ${size.x} × ${size.y} device pixels, ${formatNumber((covered / (size.x * size.y)) * 100, 2)}% covered`,
    ].join('\n');
  });
};
