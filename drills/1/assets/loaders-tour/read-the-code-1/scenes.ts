// Scenes for the loaders and textures tour. The README places each one with <div data-scene="name">.
import { choiceButtons, collectResources, COLORS, fitModel, label, overlay } from '@harness/lesson';
import { loadModel, MODELS } from '@harness/models';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// A price tag drawn with the 2D canvas API: the product name, then the price in large type.
function drawTag(ctx: CanvasRenderingContext2D, price: number) {
  const { width, height } = ctx.canvas;
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#334155';
  ctx.font = '600 40px system-ui, sans-serif';
  ctx.fillText('Rack J-cups, pair', 32, 64);
  ctx.fillStyle = '#b91c1c';
  ctx.font = '700 128px system-ui, sans-serif';
  ctx.fillText(`$${price}`, 32, 210);
}

// A 16-entry lookup table from cold to hot: red, green, blue, and alpha bytes for each pixel.
function heatTable() {
  const data = new Uint8Array(16 * 4);
  const color = new THREE.Color();
  const rgb = { r: 0, g: 0, b: 0 };
  for (let i = 0; i < 16; i++) {
    color.setHSL(0.66 * (1 - i / 15), 0.85, 0.5, THREE.SRGBColorSpace).getRGB(rgb, THREE.SRGBColorSpace);
    data.set([rgb.r * 255, rgb.g * 255, rgb.b * 255, 255], i * 4);
  }
  return data;
}

type Member = 'draco' | 'alone' | 'canvas' | 'stale' | 'data';

export const members: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(2.2, 1.5, 3.1);
  controls.target.set(0.25, 1.1, 0);
  scene.children.find((child) => child instanceof THREE.AxesHelper)!.visible = false; // it would poke through the model

  const readout = overlay(container, 'readout');
  let selected: Member = 'draco';

  // GLTFLoader with a DRACOLoader attached: the harness's shared loader is set up that way.
  let rack: THREE.Object3D | undefined;
  let rackResult = 'loading…';
  loadModel(MODELS.rackParts).then((gltf) => {
    let meshes = 0;
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) meshes++;
    });
    const { materials, textures } = collectResources(gltf.scene);
    rackResult = `${meshes} meshes, ${materials.size} materials, ${textures.size} textures`;
    rack = fitModel(gltf.scene, 2, new THREE.Vector3(0, 0.05, 0));
    scene.add(rack);
    show();
  });

  // The same file through a GLTFLoader with no decoder attached. It runs once, the first time
  // its button is picked, and the error message is kept.
  let aloneResult: string | undefined;
  const loadAlone = () => {
    aloneResult = 'loading…';
    new GLTFLoader().loadAsync(MODELS.rackParts).then(
      () => (aloneResult = 'loaded'),
      (error: Error) => (aloneResult = `rejected: ${error.message}`),
    ).then(show);
  };
  const nothing = label('nothing loaded', COLORS.red);
  nothing.position.set(0, 1, 0);

  // A price tag on a CanvasTexture. uploadedPrice is the price in the GPU's copy: the canvas as it
  // was the last time the texture was copied over.
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  let price = 119;
  drawTag(ctx, price);
  const tag = new THREE.CanvasTexture(canvas);
  tag.colorSpace = THREE.SRGBColorSpace;
  renderer.initTexture(tag); // copy the first drawing to the GPU now, so uploadedPrice starts right
  let uploadedPrice = price;
  const tagBoard = new THREE.Mesh(new THREE.PlaneGeometry(2, 1), new THREE.MeshBasicMaterial({ map: tag }));
  tagBoard.position.set(0, 1, 0);
  tagBoard.lookAt(camera.position.x, 1, camera.position.z); // turned to face the viewer, still upright

  // A DataTexture: 16 pixels made from an array, one per lookup-table entry.
  const table = new THREE.DataTexture(heatTable(), 16, 1);
  table.colorSpace = THREE.SRGBColorSpace;
  table.needsUpdate = true;
  const strip = new THREE.Mesh(new THREE.PlaneGeometry(2, 0.35), new THREE.MeshBasicMaterial({ map: table }));
  strip.position.set(0, 1, 0);
  strip.lookAt(camera.position.x, 1, camera.position.z);
  // Labels under each end of the strip, measured from the strip itself so they turn with it.
  const cold = label('entry 0', COLORS.blue);
  cold.position.copy(strip.localToWorld(new THREE.Vector3(-0.85, -0.35, 0)));
  const hot = label('entry 15', COLORS.red);
  hot.position.copy(strip.localToWorld(new THREE.Vector3(0.85, -0.35, 0)));
  scene.add(nothing, tagBoard, strip, cold, hot);

  const show = () => {
    if (rack) rack.visible = selected === 'draco';
    nothing.visible = selected === 'alone';
    tagBoard.visible = selected === 'canvas' || selected === 'stale';
    strip.visible = cold.visible = hot.visible = selected === 'data';

    const lines: Record<Member, string[]> = {
      draco: ["ran:  await loader.loadAsync('rack-parts.glb')", '      the loader has setDRACOLoader(draco)', `→ ${rackResult}`],
      alone: ["ran:  await new GLTFLoader().loadAsync('rack-parts.glb')", '      no decoder attached', `→ ${aloneResult}`],
      canvas: [
        `ran:  ctx.fillText('$${price}', 32, 210); tag.needsUpdate = true`,
        '      every second',
        `canvas says $${price}   the tag on screen shows $${uploadedPrice}`,
      ],
      stale: [
        `ran:  ctx.fillText('$${price}', 32, 210)`,
        '      every second, with no needsUpdate',
        `canvas says $${price}   the tag on screen shows $${uploadedPrice}`,
      ],
      data: ['ran:  const table = new DataTexture(data, 16, 1)', '      table.needsUpdate = true', '→ 16 × 1 pixels from a Uint8Array, each a sharp block'],
    };
    readout.textContent = lines[selected].join('\n');
  };

  // Redraw the price every second while a canvas button is picked.
  let nextRedraw = Infinity;
  let now = 0;
  onFrame((_, elapsed) => {
    now = elapsed;
    if (elapsed < nextRedraw) return;
    nextRedraw = elapsed + 1;
    price = price === 139 ? 119 : price + 1;
    drawTag(ctx, price);
    if (selected === 'canvas') {
      tag.needsUpdate = true; // copied to the GPU at the next render
      uploadedPrice = price;
    }
    show();
  });

  const pick = (member: Member) => () => {
    selected = member;
    nextRedraw = member === 'canvas' || member === 'stale' ? now + 1 : Infinity;
    if (member === 'alone' && aloneResult === undefined) loadAlone();
    show();
  };
  choiceButtons(overlay(container, 'controls'), [
    { html: 'GLTFLoader + Draco', select: pick('draco') },
    { html: 'GLTFLoader alone', select: pick('alone') },
    { html: 'CanvasTexture', select: pick('canvas') },
    { html: 'Canvas, no needsUpdate', select: pick('stale') },
    { html: 'DataTexture', select: pick('data') },
  ]);
};
