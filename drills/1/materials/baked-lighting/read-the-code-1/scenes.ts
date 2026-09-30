// Scenes for the baked lighting page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, formatNumber, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const FLOOR = 4;

// A lightmap "baked" for the crate at its starting spot: soft light over the floor, a dark, soft
// shadow under and behind the crate, and a little darkening toward the edges. Painted on a canvas,
// so its colors are sRGB.
function bakeLightmap() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const context = canvas.getContext('2d')!;
  const room = context.createRadialGradient(size / 2, size / 2, size * 0.2, size / 2, size / 2, size * 0.75);
  room.addColorStop(0, '#f2f2f2');
  room.addColorStop(1, '#8c8c8c');
  context.fillStyle = room;
  context.fillRect(0, 0, size, size);
  // The crate sits at the middle; the baked sun came from the upper left, so the shadow falls
  // toward the lower right of the texture (+X and +Z on the floor).
  const toPixels = (meters: number) => (meters / FLOOR) * size;
  const cx = size / 2 + toPixels(0.25);
  const cy = size / 2 + toPixels(0.2);
  const shadow = context.createRadialGradient(cx, cy, toPixels(0.2), cx, cy, toPixels(0.65));
  shadow.addColorStop(0, 'rgba(20, 20, 20, 0.9)');
  shadow.addColorStop(1, 'rgba(20, 20, 20, 0)');
  context.fillStyle = shadow;
  context.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture; // the canvas's top row lands on the floor's far edge (−Z), its left on −X
}

export const bakedVsLive: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(1.8, 2.3, 3);
  controls.target.set(0.2, 0.2, 0.2);
  renderer.shadowMap.enabled = true; // before the first render, for the live-shadow button
  let sky: THREE.HemisphereLight | undefined;
  for (const child of scene.children) {
    if (child instanceof THREE.HemisphereLight) sky = child;
    if (child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper) child.visible = false;
  }

  const floorGeometry = new THREE.PlaneGeometry(FLOOR, FLOOR).rotateX(-Math.PI / 2);
  floorGeometry.setAttribute('uv1', floorGeometry.attributes.uv.clone()); // a real bake has its own layout
  const bakedLight = bakeLightmap();
  bakedLight.channel = 1;
  const floorMaterial = new THREE.MeshLambertMaterial({ color: COLORS.white, lightMap: bakedLight, lightMapIntensity: 3 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.receiveShadow = true;
  const crate = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), new THREE.MeshLambertMaterial({ color: COLORS.orange }));
  crate.position.y = 0.3;
  crate.castShadow = true;
  const sun = new THREE.DirectionalLight(0xffffff, 2.5);
  sun.position.set(-2, 3, -1.6);
  sun.castShadow = true;
  scene.add(floor, crate, sun);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let baked = true;
  let offset = 0;

  const update = () => {
    crate.position.x = offset;
    floorMaterial.lightMap = baked ? bakedLight : null;
    floorMaterial.needsUpdate = true; // adding or removing a map changes the shader
    sun.visible = !baked;
    if (sky) sky.intensity = baked ? 0.5 : 0.9;
    readout.textContent = baked
      ? [
          'floor.material.lightMap = bakedLight   (channel 1: reads uv1)',
          `crate.position.x = ${formatNumber(offset)}: ${offset === 0 ? 'the crate sits where it was baked' : 'its baked shadow stays where the crate was'}`,
          'cost: one texture read per pixel, no shadow render',
        ].join('\n')
      : [
          'sun.castShadow = crate.castShadow = floor.receiveShadow = true',
          `crate.position.x = ${formatNumber(offset)}: the shadow follows the crate`,
          'cost: a render of the crate from the sun, every frame',
        ].join('\n');
  };

  choiceButtons(controlsBar, [
    { html: 'baked lightmap', select: () => ((baked = true), update()) },
    { html: 'live shadow', select: () => ((baked = false), update()) },
  ]);
  slider(controlsBar, 'move the crate', { min: -1.2, max: 1.2, step: 0.1, value: 0 }, (value) => {
    offset = value;
    update();
  });
};
