// Scenes for the texture sampling page. The README places each one with <div data-scene="name">.
import { choiceButtons, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// A floor tile with thin lines and a small checker, the kind of fine pattern that shimmers.
function floorTile() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const context = canvas.getContext('2d')!;
  context.fillStyle = '#d6d3cc';
  context.fillRect(0, 0, size, size);
  context.fillStyle = '#3b3f46';
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) if ((i + j) % 2 === 0) context.fillRect(i * 16, j * 16, 16, 16); // a small checker in one corner
  }
  context.fillRect(0, 0, size, 3); // grout lines
  context.fillRect(0, 0, 3, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 48);
  return texture;
}

export const shimmer: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0, 1.1, 3.2);
  controls.target.set(0, 0, -2.5);
  for (const child of scene.children) {
    if (child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper) child.visible = false;
  }

  const texture = floorTile();
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(6, 24).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: texture }));
  floor.position.z = -8;
  scene.add(floor);

  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  const readout = overlay(container, 'readout');
  const settings = [
    {
      name: 'mipmaps (default)',
      code: 'minFilter = LinearMipmapLinearFilter, anisotropy = 1',
      note: 'calm, but the far half blurs to gray',
      apply: () => ((texture.minFilter = THREE.LinearMipmapLinearFilter), (texture.magFilter = THREE.LinearFilter), (texture.anisotropy = 1)),
    },
    {
      name: 'no mipmaps',
      code: 'minFilter = LinearFilter',
      note: 'the far half sparkles and crawls: shimmer',
      apply: () => ((texture.minFilter = THREE.LinearFilter), (texture.magFilter = THREE.LinearFilter), (texture.anisotropy = 1)),
    },
    {
      name: 'nearest, no mipmaps',
      code: 'minFilter = magFilter = NearestFilter',
      note: 'blocky up close, and the worst shimmer far away',
      apply: () => ((texture.minFilter = THREE.NearestFilter), (texture.magFilter = THREE.NearestFilter), (texture.anisotropy = 1)),
    },
    {
      name: 'mipmaps + anisotropy',
      code: `minFilter = LinearMipmapLinearFilter, anisotropy = ${maxAnisotropy} (this GPU's maximum)`,
      note: 'calm, and sharp much farther into the distance',
      apply: () => ((texture.minFilter = THREE.LinearMipmapLinearFilter), (texture.magFilter = THREE.LinearFilter), (texture.anisotropy = maxAnisotropy)),
    },
  ];

  choiceButtons(
    overlay(container, 'controls'),
    settings.map((setting) => ({
      html: setting.name,
      select: () => {
        setting.apply();
        texture.needsUpdate = true; // filters go to the GPU with the image
        readout.textContent = [`floorTexture.${setting.code}`, setting.note, 'the floor scrolls slowly, so shimmer shows as flicker'].join('\n');
      },
    })),
  );

  onFrame((delta) => {
    texture.offset.y = (texture.offset.y + delta * 0.25) % 1; // a slow conveyor, so shimmer shows
  });
};
