// Scenes for the channel packing page. The README places each one with <div data-scene="name">.
import { choiceButtons, overlay, roomEnvironment } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const SIZE = 64;

// The three grayscale maps, as numbers from 0 to 255 at texel (x, y), row 0 at the bottom (v = 0).
// Around the ball, u runs from its left edge (0) through the side facing the camera (0.25) to its
// right edge (0.5): the left half of what the camera sees is metal, the right half isn't. Roughness climbs from smooth at the top to rough at the bottom. A dark AO band runs
// around the middle, like a crease.
const occlusion = (x: number, y: number) => (Math.abs(y - SIZE / 2) < 3 ? 60 : 255);
const roughness = (x: number, y: number) => Math.round(255 * (1 - y / (SIZE - 1)) * 0.9 + 12);
const metalness = (x: number) => (x < SIZE * 0.25 ? 255 : 0);

function pack(order: ((x: number, y: number) => number)[]) {
  const data = new Uint8Array(SIZE * SIZE * 4);
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const i = (y * SIZE + x) * 4;
      order.forEach((map, channel) => (data[i + channel] = map(x, y)));
      data[i + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(data, SIZE, SIZE); // colorSpace stays NoColorSpace: data, not color
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

// One channel of the packed texture as a small grayscale picture, for the strip in the corner.
function channelImage(map: (x: number, y: number) => number, text: string) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SIZE;
  const context = canvas.getContext('2d')!;
  const image = context.createImageData(SIZE, SIZE);
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const value = map(x, SIZE - 1 - y); // the canvas's top row is v = 1
      image.data.set([value, value, value, 255], (y * SIZE + x) * 4);
    }
  }
  context.putImageData(image, 0, 0);
  const figure = document.createElement('figure');
  figure.style.cssText = 'margin: 0; text-align: center; font: 600 11px system-ui, sans-serif; color: #e5e7eb;';
  const img = new Image();
  img.src = canvas.toDataURL();
  img.style.cssText = 'display: block; width: 56px; height: 56px; image-rendering: pixelated; border: 1px solid #555;';
  figure.append(img, text);
  return figure;
}

export const packed: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(0, 1.25, 2.4);
  controls.target.set(0, 1.1, 0);
  const sky = scene.children.find((child) => child instanceof THREE.HemisphereLight);
  if (sky) sky.visible = false;
  scene.environment = roomEnvironment(renderer);

  const orm = pack([occlusion, roughness, metalness]); // glTF's order: R occlusion, G roughness, B metalness
  const reordered = pack([roughness, occlusion, metalness]); // another tool's order: roughness in red
  const material = new THREE.MeshStandardMaterial({ color: '#c9a86a' });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.7, 96, 48), material);
  ball.position.set(0, 1.1, 0);
  scene.add(ball);

  const strip = document.createElement('div');
  strip.style.cssText = 'position: absolute; right: 10px; top: 10px; display: flex; gap: 6px;';
  strip.append(channelImage(occlusion, 'R: AO'), channelImage(roughness, 'G: rough'), channelImage(metalness, 'B: metal'));
  container.append(strip);

  const readout = overlay(container, 'readout');
  const options = [
    {
      name: 'glTF order',
      map: orm,
      metalness: 1,
      lines: ['aoMap = roughnessMap = metalnessMap = orm; metalness = 1', 'left: metal, right: not; smooth at the top, rough at the bottom'],
    },
    {
      name: 'roughness packed in red',
      map: reordered,
      metalness: 1,
      lines: ['the same maps, packed R roughness, G AO, B metal', 'roughness is read from green, which now holds the AO: rough almost everywhere'],
    },
    {
      name: 'metalness left at 0',
      map: orm,
      metalness: 0,
      lines: ['glTF order, but material.metalness = 0 (the default)', 'the metalness map is multiplied by 0: no metal anywhere'],
    },
  ];
  choiceButtons(
    overlay(container, 'controls'),
    options.map((option) => ({
      html: option.name,
      select: () => {
        material.aoMap = material.roughnessMap = material.metalnessMap = option.map;
        material.metalness = option.metalness;
        material.roughness = 1;
        material.needsUpdate = true;
        readout.textContent = option.lines.join('\n');
      },
    })),
  );
};
