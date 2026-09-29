// Scenes for the UVs page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, formatNumber, label, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// A picture with a lopsided letter F, so tiling and mirroring both show, and colored edges, so
// clamping shows as streaks.
function letterTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const context = canvas.getContext('2d')!;
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      context.fillStyle = (x + y) % 2 === 0 ? '#1e3a5f' : '#2b4c7e';
      context.fillRect(x * 64, y * 64, 64, 64);
    }
  }
  context.fillStyle = '#facc15';
  context.fillRect(0, 0, 256, 10); // top edge
  context.fillStyle = '#22c55e';
  context.fillRect(246, 0, 10, 256); // right edge
  context.fillStyle = '#e5e7eb';
  context.font = '700 170px system-ui, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('F', 128, 138);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const WRAPS = [
  { name: 'ClampToEdgeWrapping', value: THREE.ClampToEdgeWrapping, note: 'default: past 1, the edge pixels stretch' },
  { name: 'RepeatWrapping', value: THREE.RepeatWrapping, note: 'past 1, the image tiles' },
  { name: 'MirroredRepeatWrapping', value: THREE.MirroredRepeatWrapping, note: 'past 1, it tiles, flipping every other copy' },
];

export const wrap: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.3, 3.6);
  controls.target.set(0, 1.25, 0);

  const geometry = new THREE.PlaneGeometry(2.2, 1.3);
  const uv = geometry.attributes.uv;
  const original = uv.array.slice();
  const texture = letterTexture();
  const panel = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }));
  panel.position.y = 1.0;
  scene.add(panel);

  // A tag at each corner showing its UV.
  const corner = new THREE.Vector3();
  let tags: THREE.Sprite[] = [];

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let range = 2;
  let wrapping = WRAPS[0];

  const update = () => {
    for (let i = 0; i < uv.count; i++) uv.setXY(i, original[i * 2] * range, original[i * 2 + 1] * range);
    uv.needsUpdate = true;

    for (const tag of tags) scene.remove(tag);
    tags = Array.from({ length: uv.count }, (_, i) => {
      const tag = label(`(${formatNumber(uv.getX(i))}, ${formatNumber(uv.getY(i))})`, COLORS.white);
      corner.fromBufferAttribute(geometry.attributes.position, i).add(panel.position);
      tag.position.copy(corner).add(new THREE.Vector3(Math.sign(corner.x) * 0.42, (i < 2 ? 1 : -1) * 0.1, 0));
      tag.scale.multiplyScalar(0.8);
      scene.add(tag);
      return tag;
    });

    readout.textContent = [
      `uv.setXY(i, u * ${range}, v * ${range})   // the top-right corner is (${range}, ${range})`,
      `texture.wrapS = texture.wrapT = ${wrapping.name}`,
      `texture.needsUpdate = true   // ${wrapping.note}`,
    ].join('\n');
  };

  choiceButtons(
    controlsBar,
    WRAPS.map((item) => ({
      html: `<code>${item.name}</code>`,
      select: () => {
        wrapping = item;
        texture.wrapS = texture.wrapT = item.value;
        texture.needsUpdate = true; // wrap settings go to the GPU with the image
        update();
      },
    })),
  );
  slider(controlsBar, 'UV range', { min: 1, max: 3, step: 0.5, value: range }, (value) => {
    range = value;
    update();
  });
};
