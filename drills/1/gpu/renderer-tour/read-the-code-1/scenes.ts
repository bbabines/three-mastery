// Scenes for the renderer settings tour. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, drawYourself, overlay, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';

const TONE_MAPPING_NAMES: Record<number, string> = {
  [THREE.NoToneMapping]: 'NoToneMapping',
  [THREE.NeutralToneMapping]: 'NeutralToneMapping',
};

// A small storage rack with two bins: thin uprights and shelf edges show jagged edges, and the
// shelves throw clear shadows. Returns the rack and its meshes.
function buildRack() {
  const rack = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: COLORS.blue, roughness: 0.5 });
  const shelfMaterial = new THREE.MeshStandardMaterial({ color: COLORS.white, roughness: 0.6 });
  const binMaterial = new THREE.MeshStandardMaterial({ color: COLORS.orange, roughness: 0.5 });
  for (const x of [-0.6, 0.6]) {
    for (const z of [-0.25, 0.25]) {
      const upright = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.7, 0.05), steel);
      upright.position.set(x, 0.85, z);
      rack.add(upright);
    }
  }
  for (const y of [0.3, 0.9, 1.5]) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.04, 0.55), shelfMaterial);
    shelf.position.y = y;
    rack.add(shelf);
  }
  const binA = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.4), binMaterial);
  binA.position.set(-0.3, 1.07, 0);
  const binB = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.25, 0.4), binMaterial);
  binB.position.set(0.3, 0.445, 0);
  rack.add(binA, binB);
  const meshes = rack.children as THREE.Mesh[];
  return { rack, meshes, materials: [steel, shelfMaterial, binMaterial] };
}

export const settings: SceneSetup = (harness) => {
  const { camera, controls, container, renderer, onFrame } = harness;
  camera.position.set(1.85, 1.9, 2.85);
  controls.target.set(0.15, 1.0, -0.2);

  // This scene draws each frame itself, so it can draw through an offscreen picture for "antialias off".
  const world = drawYourself(harness);
  for (const child of world.children) {
    if (child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper) child.visible = false; // not part of the rack's draw calls
  }
  // A bright studio light: without tone mapping, the lit faces clip to flat white.
  const sun = sunlight(world, new THREE.Vector3(-1.5, 5, 2.5), 0.6, 9);
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.normalBias = 0.02;

  const { rack, meshes, materials } = buildRack();
  const floorMaterial = new THREE.MeshStandardMaterial({ color: COLORS.gray, roughness: 0.9 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14).rotateX(-Math.PI / 2), floorMaterial);
  world.add(rack, floor);
  const allMaterials = [...materials, floorMaterial];

  // The look of antialias: false. The canvas can't lose its antialiasing, so for that button the
  // frame is drawn into a picture with none (samples: 0), then copied to the canvas.
  const plain = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType });
  const copy = new FullScreenQuad(new THREE.MeshBasicMaterial({ map: plain.texture }));
  let antialiasOff = false;
  let ran = '';

  const reset = () => {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.shadowMap.enabled = false;
    sun.castShadow = false;
    for (const mesh of meshes) mesh.castShadow = false;
    floor.receiveShadow = false;
    antialiasOff = false;
    // Every button starts from scratch, so rebuild each material's program for the new settings.
    for (const material of allMaterials) material.needsUpdate = true;
  };

  const members: { name: string; code: string; run: () => void }[] = [
    { name: 'defaults', code: 'new WebGLRenderer({ antialias: true })', run: () => {} },
    { name: 'antialias off', code: 'new WebGLRenderer({ antialias: false })   // its look', run: () => (antialiasOff = true) },
    { name: 'setPixelRatio', code: 'renderer.setPixelRatio(0.5)', run: () => renderer.setPixelRatio(0.5) },
    {
      name: 'outputColorSpace',
      code: 'renderer.outputColorSpace = LinearSRGBColorSpace',
      run: () => (renderer.outputColorSpace = THREE.LinearSRGBColorSpace),
    },
    { name: 'toneMapping', code: 'renderer.toneMapping = NeutralToneMapping', run: () => (renderer.toneMapping = THREE.NeutralToneMapping) },
    { name: 'shadowMap only', code: 'renderer.shadowMap.enabled = true', run: () => (renderer.shadowMap.enabled = true) },
    {
      name: 'shadows',
      code: 'renderer.shadowMap.enabled = true; sun.castShadow = true; each rack mesh.castShadow = true; floor.receiveShadow = true',
      run: () => {
        renderer.shadowMap.enabled = true;
        sun.castShadow = true;
        for (const mesh of meshes) mesh.castShadow = true;
        floor.receiveShadow = true;
      },
    },
  ];
  choiceButtons(
    overlay(container, 'controls'),
    members.map((member) => ({
      html: member.name,
      select: () => {
        reset();
        member.run();
        ran = member.code;
      },
    })),
  );

  const readout = overlay(container, 'readout');
  const css = new THREE.Vector2();
  const device = new THREE.Vector2();
  onFrame(() => {
    renderer.getDrawingBufferSize(device);
    if (antialiasOff) {
      if (plain.width !== device.x || plain.height !== device.y) plain.setSize(device.x, device.y);
      renderer.setRenderTarget(plain);
      renderer.render(world, camera);
      renderer.setRenderTarget(null);
    } else {
      renderer.render(world, camera);
    }
    const calls = renderer.info.render.calls; // read now: the next render resets it
    if (antialiasOff) copy.render(renderer);

    renderer.getSize(css);
    readout.textContent = [
      `ran:  ${ran}`,
      `canvas ${css.x} × ${css.y} CSS px → ${device.x} × ${device.y} device px   (pixel ratio ${renderer.getPixelRatio()})`,
      `outputColorSpace '${renderer.outputColorSpace}'   toneMapping ${TONE_MAPPING_NAMES[renderer.toneMapping]}   exposure ${renderer.toneMappingExposure}`,
      `shadowMap.enabled ${renderer.shadowMap.enabled}   draw calls last frame ${calls}`,
    ].join('\n');
  });
};
