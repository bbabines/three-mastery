// Scenes for the render targets page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, formatBytes, overlay, showCamera, slider, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// 8-bit color is 4 bytes a pixel; the 24-bit depth buffer is usually stored in 4 bytes a pixel too.
const targetBytes = (width: number, height: number) => width * height * 4 * 2;

const WIDTHS = [32, 64, 128, 256, 512, 1024];

export const monitor: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0.1, 1.9, 4.1);
  controls.target.set(-0.1, 1.05, 0);
  sunlight(scene, new THREE.Vector3(2, 5, 4), 0.8, 2);

  const product = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.35, 0.12, 128, 16),
    new THREE.MeshStandardMaterial({ color: COLORS.orange, roughness: 0.4 }),
  );
  product.position.set(-1.2, 0.8, 0.2);

  // The security camera, with a small body so it shows in the scene. Its picture is 4:3.
  const security = new THREE.PerspectiveCamera(35, 4 / 3, 0.1, 20);
  security.position.set(-2.1, 1.7, 1.7);
  security.lookAt(product.position);
  showCamera(security); // adds the body; the outline it returns isn't needed here

  let width = 256;
  const target = new THREE.WebGLRenderTarget(width, (width * 3) / 4);
  target.texture.magFilter = THREE.NearestFilter; // show the target's own pixels, blocky when small
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.35), new THREE.MeshBasicMaterial({ map: target.texture }));
  screen.position.set(0.95, 1.3, -0.2);
  screen.rotation.y = -0.35;
  const bezel = new THREE.Mesh(new THREE.BoxGeometry(1.95, 1.5, 0.06), new THREE.MeshStandardMaterial({ color: '#2a2d35' }));
  bezel.position.set(0, 0, -0.035);
  screen.add(bezel);
  const stand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 0.08), new THREE.MeshStandardMaterial({ color: '#2a2d35' }));
  stand.position.set(0, -0.92, -0.05); // its foot just above the floor grid
  screen.add(stand);
  scene.add(product, security, screen);

  slider(overlay(container, 'controls'), 'target width', { min: 0, max: WIDTHS.length - 1, step: 1, value: WIDTHS.indexOf(width) }, (value) => {
    width = WIDTHS[value];
    target.setSize(width, (width * 3) / 4);
  });

  const readout = overlay(container, 'readout');
  onFrame((delta) => {
    product.rotation.y += delta * 0.6;
    const canvasCalls = renderer.info.render.calls; // the harness's render of the last frame

    // The monitor's picture: the scene seen by the security camera, drawn into the target. The
    // screen is hidden meanwhile, since a draw can't read the texture it's writing to.
    screen.visible = false;
    renderer.setRenderTarget(target);
    renderer.render(scene, security);
    renderer.setRenderTarget(null);
    screen.visible = true;
    const targetCalls = renderer.info.render.calls;

    const height = (width * 3) / 4;
    readout.textContent = [
      `new WebGLRenderTarget(${width}, ${height})   rendered from the security camera every frame`,
      `GPU memory about ${formatBytes(targetBytes(width, height))}: ${width} × ${height} × 4 bytes of color, and the same for depth`,
      `draw calls per frame: ${targetCalls} into the target + ${canvasCalls} to the canvas`,
    ].join('\n');
  });
};

const FINISHES = [
  { name: 'matte orange', color: COLORS.orange, roughness: 0.9 },
  { name: 'glossy blue', color: COLORS.blue, roughness: 0.15 },
  { name: 'satin green', color: COLORS.green, roughness: 0.45 },
];
const SWATCH = 256;

export const thumbnails: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0, 1.2, 2.7);
  controls.target.set(0, 1.05, -0.3);
  const axes = scene.children.find((child) => child instanceof THREE.AxesHelper);
  if (axes) axes.visible = false; // it would stand in front of the middle card

  // The swatch studio: its own scene, camera, and lights, never shown directly.
  const studio = new THREE.Scene();
  studio.background = new THREE.Color('#2a2d35');
  studio.add(new THREE.HemisphereLight(0xffffff, 0x404040, 1.2));
  const key = new THREE.DirectionalLight(0xffffff, 2.5);
  key.position.set(2, 3, 3);
  studio.add(key);
  const product = new THREE.Mesh(new THREE.TorusKnotGeometry(0.5, 0.17, 128, 16));
  studio.add(product);
  const studioCamera = new THREE.PerspectiveCamera(35, 1, 0.1, 10);
  studioCamera.position.set(0, 0.4, 3);
  studioCamera.lookAt(0, 0, 0);

  const finishes = FINISHES.map((finish) => new THREE.MeshStandardMaterial({ color: finish.color, roughness: finish.roughness }));
  const targets = FINISHES.map(() => new THREE.WebGLRenderTarget(SWATCH, SWATCH));
  targets.forEach((target, i) => {
    const card = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), new THREE.MeshBasicMaterial({ map: target.texture }));
    card.position.set((i - 1) * 1.05, 1.05, -0.3);
    scene.add(card);
  });

  // Renders each finish into its own target and returns the draw calls that took.
  const renderSwatches = () => {
    let calls = 0;
    finishes.forEach((finish, i) => {
      product.material = finish;
      renderer.setRenderTarget(targets[i]);
      renderer.render(studio, studioCamera);
      calls += renderer.info.render.calls;
    });
    renderer.setRenderTarget(null);
    return calls;
  };

  let everyFrame = false;
  choiceButtons(overlay(container, 'controls'), [
    { html: 'render once', select: () => ((everyFrame = false), renderSwatches()) },
    { html: 'render every frame', select: () => (everyFrame = true) },
  ]);

  const readout = overlay(container, 'readout');
  onFrame((delta) => {
    product.rotation.y += delta * 0.8;
    const canvasCalls = renderer.info.render.calls; // the harness's render of the last frame
    const swatchCalls = everyFrame ? renderSwatches() : 0;
    readout.textContent = [
      everyFrame
        ? 'rendered every frame: the swatches stay live, at the cost of three more renders'
        : 'rendered once, on pressing the button: the cards keep showing that picture',
      `draw calls last frame: ${swatchCalls} into the targets + ${canvasCalls} to the canvas`,
      `GPU memory about ${formatBytes(3 * targetBytes(SWATCH, SWATCH))} for the three ${SWATCH} × ${SWATCH} targets, either way`,
    ].join('\n');
  });
};
