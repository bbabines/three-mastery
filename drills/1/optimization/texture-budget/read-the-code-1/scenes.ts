// Scenes for the texture budget page. The README places each one with <div data-scene="name">.
import { buttonGroup, choiceButtons, COLORS, formatBytes, hideFloorHelpers, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// A woven-fabric swatch drawn at any size, with the same design at every size, so only the
// resolution changes. Without a color it's gray, for tinting with material.color. With `print`,
// it adds small text, where softness shows first.
function swatchTexture(size: number, color = '#c8ccd4', print = false) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const context = canvas.getContext('2d')!;
  context.scale(size / 512, size / 512);
  context.fillStyle = color;
  context.fillRect(0, 0, 512, 512);
  context.globalAlpha = 0.35;
  context.fillStyle = '#000000';
  for (let row = 0; row < 64; row++) {
    for (let col = 0; col < 64; col++) {
      if ((row + col) % 2 === 0) context.fillRect(col * 8, row * 8 + 1, 8, 3);
      else context.fillRect(col * 8 + 1, row * 8, 3, 8);
    }
  }
  if (print) {
    context.globalAlpha = 1;
    context.fillStyle = '#111827';
    context.fillRect(40, 380, 432, 96);
    context.fillStyle = '#f9fafb';
    context.font = '600 28px system-ui, sans-serif';
    context.fillText('FABRIC 186 · LINEN WEAVE', 56, 420);
    context.font = '16px system-ui, sans-serif';
    context.fillText('100% linen · 320 g/m² · rub test 40,000 cycles', 56, 454);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// GPU bytes for an 8-bit RGBA texture with its mipmaps.
const textureBytes = (size: number) => (THREE.TextureUtils.getByteLength(size, size, THREE.RGBAFormat, THREE.UnsignedByteType) * 4) / 3;

// How many device pixels across a flat square, `half` units from its center to each side, covers
// on screen: its corners, projected.
const corners = [new THREE.Vector2(-1, -1), new THREE.Vector2(1, -1), new THREE.Vector2(1, 1), new THREE.Vector2(-1, 1)];
const corner = new THREE.Vector3();
const buffer = new THREE.Vector2();
function pixelsAcross(mesh: THREE.Mesh, half: number, camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
  renderer.getDrawingBufferSize(buffer);
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const point of corners) {
    corner.set(point.x * half, point.y * half, 0).applyMatrix4(mesh.matrixWorld).project(camera);
    minX = Math.min(minX, corner.x);
    maxX = Math.max(maxX, corner.x);
    minY = Math.min(minY, corner.y);
    maxY = Math.max(maxY, corner.y);
  }
  return Math.round(Math.max(((maxX - minX) / 2) * buffer.x, ((maxY - minY) / 2) * buffer.y));
}

// The smallest power-of-two size that covers `pixels`.
const enough = (pixels: number) => 2 ** Math.max(5, Math.ceil(Math.log2(Math.max(pixels, 1))));

const SIZES = [256, 512, 1024, 2048, 4096];

export const onScreen: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  hideFloorHelpers(scene);
  const swatch = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial());
  swatch.position.set(0, 1, 0);
  scene.add(swatch);

  let size = 2048;
  const setSize = (next: number) => {
    swatch.material.map?.dispose();
    size = next;
    swatch.material.map = swatchTexture(size, COLORS.blue, true);
    swatch.material.needsUpdate = true;
  };
  setSize(size);
  const place = (distance: number) => {
    camera.position.set(0, 1, distance);
    controls.target.set(0, 1, 0);
  };
  place(3.2);

  const bar = overlay(container, 'controls');
  slider(bar, 'texture size', { min: 0, max: SIZES.length - 1, step: 1, value: SIZES.indexOf(size) }, (index) => setSize(SIZES[index]));
  slider(bar, 'distance', { min: 0.8, max: 8, step: 0.1, value: 3.2 }, place);

  const readout = overlay(container, 'readout');
  onFrame(() => {
    swatch.updateMatrixWorld();
    const across = pixelsAcross(swatch, 0.5, camera, renderer);
    const need = enough(across);
    readout.textContent = [
      `texture ${size} × ${size}: ${formatBytes(textureBytes(size))} on the GPU, with mipmaps`,
      `the swatch covers about ${across} × ${across} device pixels`,
      need < size
        ? `a ${need} × ${need} texture would look the same here, at ${formatBytes(textureBytes(need))}`
        : need > size
          ? `fewer pixels than the swatch covers: it looks soft up close`
          : 'about the right size for this view',
    ].join('\n');
  });
};

const SWATCH_COLORS = ['#1e3a8a', '#b91c1c', '#15803d', '#a16207', '#6b21a8', '#0f766e', '#be185d', '#374151', '#c2410c', '#4d7c0f', '#0369a1', '#78350f'];
const LIBRARY_SIZES = [1024, 256, 64];

export const library: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0, 1.1, 3.5);
  controls.target.set(0, 1.1, 0);
  hideFloorHelpers(scene);

  const swatches = SWATCH_COLORS.map((_, i) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.6), new THREE.MeshBasicMaterial());
    mesh.position.set(-1.14 + (i % 4) * 0.76, 1.66 - Math.floor(i / 4) * 0.7, 0);
    scene.add(mesh);
    return mesh;
  });

  let size = LIBRARY_SIZES[0];
  let shared = false;
  let textures: THREE.Texture[] = [];
  const rebuild = () => {
    for (const texture of textures) texture.dispose();
    if (shared) {
      const weave = swatchTexture(size);
      textures = [weave];
      swatches.forEach((mesh, i) => {
        mesh.material.map = weave;
        mesh.material.color.set(SWATCH_COLORS[i]).multiplyScalar(1.6); // a lighter tint, since the gray weave darkens it
        mesh.material.needsUpdate = true;
      });
    } else {
      textures = SWATCH_COLORS.map((color) => swatchTexture(size, color));
      swatches.forEach((mesh, i) => {
        mesh.material.map = textures[i];
        mesh.material.color.set('white');
        mesh.material.needsUpdate = true;
      });
    }
  };

  const bar = overlay(container, 'controls');
  choiceButtons(
    buttonGroup(bar, 'Size:'),
    LIBRARY_SIZES.map((option) => ({ html: `${option}`, select: () => ((size = option), rebuild()) })),
  );
  choiceButtons(buttonGroup(bar), [
    { html: 'a texture per swatch', select: () => ((shared = false), rebuild()) },
    { html: 'one shared, tinted by color', select: () => ((shared = true), rebuild()) },
  ]);

  const readout = overlay(container, 'readout');
  onFrame(() => {
    swatches[0].updateMatrixWorld();
    const across = pixelsAcross(swatches[0], 0.3, camera, renderer);
    const need = enough(across);
    readout.textContent = [
      shared ? `one ${size} × ${size} gray texture, material.color tints each swatch` : `${swatches.length} × a ${size} × ${size} texture, one per swatch`,
      `renderer.info.memory.textures ${renderer.info.memory.textures} · ${formatBytes(textures.length * textureBytes(size))} on the GPU`,
      `each swatch covers about ${across} × ${across} device pixels`,
      size > need ? `more than it needs: ${need} × ${need} looks the same` : size < need ? 'fewer than it needs: soft' : 'about the right size',
    ].join('\n');
  });
};
