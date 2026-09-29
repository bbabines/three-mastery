// Scenes for the pipeline-facing material flags page. The README places each one with <div data-scene="name">.
import { ball, buttonGroup, choiceButtons, COLORS, label, overlay, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// A logo drawn on a canvas.
function logoTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const context = canvas.getContext('2d')!;
  context.fillStyle = '#1e3a8a';
  context.fillRect(0, 0, 256, 128);
  context.fillStyle = '#facc15';
  context.font = '700 64px system-ui, sans-serif';
  context.fillText('ACME', 36, 88);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// A sheet of perforated metal: gray, with round holes whose alpha is 0.
function holesTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const context = canvas.getContext('2d')!;
  context.fillStyle = '#b8bcc4';
  context.fillRect(0, 0, 256, 256);
  for (let y = 16; y < 256; y += 32) {
    for (let x = 16; x < 256; x += 32) {
      context.clearRect(x - 11, y - 11, 22, 22); // alpha 0 around each hole's spot...
      context.fillStyle = '#b8bcc4';
      context.beginPath();
      context.rect(x - 11, y - 11, 22, 22);
      context.arc(x, y, 10, 0, Math.PI * 2, true); // ...then metal back in, leaving a round hole
      context.fill();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export const flags: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.75, 3);
  controls.target.set(0, 0.8, 0);
  sunlight(scene, new THREE.Vector3(1.5, 3, 3), 0.9, 2);

  // 1. A logo on a panel, in exactly the same plane as the panel's front face.
  const panel = new THREE.Mesh(new THREE.BoxGeometry(1, 0.7, 0.06), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  panel.position.set(-1.45, 0.9, 0);
  const logoMaterial = new THREE.MeshBasicMaterial({ map: logoTexture() });
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.35), logoMaterial);
  logo.position.set(-1.45, 0.9, 0.03);

  // 2. A perforated panel, with a ball behind it to see through the holes.
  const perforatedMaterial = new THREE.MeshStandardMaterial({ map: holesTexture(), side: THREE.DoubleSide });
  const perforated = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.8), perforatedMaterial);
  perforated.position.set(0, 0.9, 0);
  const behind = ball(COLORS.orange, 1, 0.25);
  behind.position.set(0, 0.9, -0.5);

  // 3. A thin cup: one open, single-layer surface, seen from above.
  const cupMaterial = new THREE.MeshStandardMaterial({ color: COLORS.green });
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.28, 0.55, 40, 1, true), cupMaterial);
  cup.position.set(1.45, 0.4, 0);

  const tags: [string, number][] = [
    ['decal', -1.45],
    ['perforated panel', 0],
    ['thin cup', 1.45],
  ];
  for (const [text, x] of tags) {
    const tag = label(text, COLORS.white);
    tag.position.set(x, 1.55, 0);
    scene.add(tag);
  }
  scene.add(panel, logo, perforated, behind, cup);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const lines = ['', '', ''];
  const show = () => (readout.textContent = lines.join('\n'));

  choiceButtons(buttonGroup(controlsBar, 'decal:'), [
    {
      html: 'no offset',
      select: () => {
        logoMaterial.polygonOffset = false;
        lines[0] = 'logo: same depth as the panel: they fight, and it flickers (z-fighting)';
        show();
      },
    },
    {
      html: 'polygonOffset',
      select: () => {
        logoMaterial.polygonOffset = true;
        logoMaterial.polygonOffsetFactor = logoMaterial.polygonOffsetUnits = -1;
        lines[0] = 'logo: polygonOffset: true, factor -1, units -1: pulled toward the camera, it wins';
        show();
      },
    },
  ]);
  const panelOptions = [
    { html: 'neither', transparent: false, alphaTest: 0, line: 'panel: neither flag: the texture’s alpha is ignored, holes drawn solid' },
    { html: 'alphaTest 0.5', transparent: false, alphaTest: 0.5, line: 'panel: alphaTest: 0.5: hard-edged holes, still opaque, no sorting' },
    { html: 'transparent', transparent: true, alphaTest: 0, line: 'panel: transparent: true: blended, sorted with the see-through objects' },
  ];
  choiceButtons(
    buttonGroup(controlsBar, 'panel:'),
    panelOptions.map((option) => ({
      html: option.html,
      select: () => {
        perforatedMaterial.transparent = option.transparent;
        perforatedMaterial.alphaTest = option.alphaTest;
        perforatedMaterial.needsUpdate = true; // alphaTest on or off changes the shader
        lines[1] = option.line;
        show();
      },
    })),
  );
  choiceButtons(buttonGroup(controlsBar, 'cup:'), [
    {
      html: 'FrontSide',
      select: () => {
        cupMaterial.side = THREE.FrontSide;
        cupMaterial.needsUpdate = true;
        lines[2] = 'cup: FrontSide: the inside faces away, so it isn’t drawn';
        show();
      },
    },
    {
      html: 'DoubleSide',
      select: () => {
        cupMaterial.side = THREE.DoubleSide;
        cupMaterial.needsUpdate = true;
        lines[2] = 'cup: DoubleSide: inside drawn too, and the GPU shades every back face';
        show();
      },
    },
  ]);
};
