// Scenes for the interleaved attributes page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, formatNumber, label, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { interleaveAttributes } from 'three/addons/utils/BufferGeometryUtils.js';

const COLUMNS = ['x', 'y', 'z', 'u', 'v'];
const LIFT = 0.4;

// A spreadsheet-like picture, so a UV that changes shows up as the cells sliding.
function sheetTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext('2d')!;
  const [columns, rows] = [6, 3];
  const [w, h] = [canvas.width / columns, canvas.height / rows];
  context.font = '600 34px system-ui, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      context.fillStyle = (r + c) % 2 === 0 ? '#1e3a5f' : '#2b4c7e';
      context.fillRect(c * w, r * h, w, h);
      context.fillStyle = '#e5e7eb';
      context.fillText(`${'ABCDEF'[c]}${r + 1}`, c * w + w / 2, r * h + h / 2);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export const lift: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.3, 1.3, 3.1);
  controls.target.set(0, 1.12, 0);

  // A panel of 6 vertices, 3 across and 2 down, with position and UV interleaved: x y z u v.
  const geometry = new THREE.PlaneGeometry(2.4, 1.1, 2, 1);
  geometry.deleteAttribute('normal');
  const attributes = [geometry.attributes.position, geometry.attributes.uv] as THREE.BufferAttribute[];
  // interleaveAttributes returns an array; its type declaration says a single attribute.
  const [position, uv] = interleaveAttributes(attributes) as unknown as THREE.InterleavedBufferAttribute[];
  geometry.setAttribute('position', position);
  geometry.setAttribute('uv', uv);
  const data = position.data;
  const pristine = data.array.slice();

  const panel = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: sheetTexture(), side: THREE.DoubleSide }));
  panel.position.y = 1;
  panel.frustumCulled = false; // its corners move, so its stored bounds can go stale
  scene.add(panel);

  const tags = Array.from({ length: position.count }, (_, i) => {
    const tag = label(String(i), COLORS.yellow);
    scene.add(tag);
    return tag;
  });

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let useSetter = true;
  let vertex = 4;
  const corner = new THREE.Vector3();

  const update = () => {
    data.array.set(pristine);
    const y = position.getY(vertex) + LIFT;
    const slot = useSetter ? vertex * data.stride + position.offset + 1 : vertex * 3 + 1;
    if (useSetter) position.setY(vertex, y);
    else data.array[slot] = y;
    position.needsUpdate = true;

    tags.forEach((tag, i) => {
      corner.fromBufferAttribute(position, i).add(panel.position);
      tag.position.copy(corner).add(new THREE.Vector3(0, i < 3 ? 0.2 : -0.2, 0.02));
    });

    const hit = `the ${COLUMNS[slot % data.stride]} of vertex ${Math.floor(slot / data.stride)}`;
    const wanted = `the y of vertex ${vertex}`;
    readout.textContent = [
      useSetter
        ? `position.setY(${vertex}, ${formatNumber(y)})   // ${vertex} × stride ${data.stride} + offset ${position.offset}, then y`
        : `position.array[${slot}] = ${formatNumber(y)}   // ${vertex} × 3 + 1`,
      `writes data.array[${slot}]: ${hit}${hit === wanted ? '' : `, not ${wanted}`}`,
      'position.needsUpdate = true',
      `data.stride ${data.stride}   position.offset ${position.offset}   uv.offset ${uv.offset}`,
    ].join('\n');
  };

  choiceButtons(controlsBar, [
    {
      html: '<code>position.setY(i, y)</code>',
      select: () => {
        useSetter = true;
        update();
      },
    },
    {
      html: '<code>position.array[i * 3 + 1] = y</code>',
      select: () => {
        useSetter = false;
        update();
      },
    },
  ]);
  slider(controlsBar, 'lift vertex i', { min: 0, max: position.count - 1, step: 1, value: vertex }, (value) => {
    vertex = value;
    update();
  });
};
