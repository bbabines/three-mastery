// Scenes for the readback page. The README places each one with <div data-scene="name">.
import { buttonGroup, choiceButtons, COLORS, overlay, pointerSpot, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const picking: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0, 3.2, 4.2);
  controls.target.set(0, 0.3, 0);
  sunlight(scene, new THREE.Vector3(2, 5, 3), 0.8, 2);
  const axes = scene.children.find((child) => child instanceof THREE.AxesHelper);
  if (axes) axes.visible = false; // it would stand among the boxes

  // Twenty boxes. The ID scene holds a copy of each in a flat color whose red byte is its number.
  const idScene = new THREE.Scene();
  idScene.background = new THREE.Color(0x000000); // 0: nothing there
  const geometry = new THREE.BoxGeometry(0.45, 0.45, 0.45);
  const boxes: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>[] = [];
  for (let i = 0; i < 20; i++) {
    const box = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: COLORS.blue }));
    box.position.set(((i % 5) - 2) * 0.75, 0.28, (Math.floor(i / 5) - 1.5) * 0.75);
    box.rotation.y = i * 0.4;
    scene.add(box);
    boxes.push(box);
    // setRGB takes linear values, and a render target stores linear values, so the byte is i + 1.
    const idBox = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: new THREE.Color().setRGB((i + 1) / 255, 0, 0) }));
    idBox.position.copy(box.position);
    idBox.rotation.copy(box.rotation);
    idScene.add(idBox);
  }

  const pickTarget = new THREE.WebGLRenderTarget(1, 1); // 8-bit RGBA: always readable
  const pixel = new Uint8Array(4);
  const canvas = renderer.domElement;
  let asyncMode = false;
  let frame = 0;
  let pending = false;
  let picked = 0;
  let waitedFrames = 0;

  const show = (id: number) => {
    picked = id;
    boxes.forEach((box, i) => box.material.color.set(i + 1 === id ? COLORS.orange : COLORS.blue));
  };

  // Renders the ID scene into the 1 × 1 target, for just the pixel under the pointer.
  const renderPick = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    camera.setViewOffset(rect.width, rect.height, event.clientX - rect.left, event.clientY - rect.top, 1, 1);
    renderer.setRenderTarget(pickTarget);
    renderer.render(idScene, camera);
    renderer.setRenderTarget(null);
    camera.clearViewOffset();
  };

  const pick = (event: PointerEvent) => {
    if (!asyncMode) {
      renderPick(event);
      renderer.readRenderTargetPixels(pickTarget, 0, 0, 1, 1, pixel); // JavaScript waits here
      show(pixel[0]);
      return;
    }
    if (pending) return; // one question at a time
    pending = true;
    renderPick(event);
    const asked = frame;
    renderer.readRenderTargetPixelsAsync(pickTarget, 0, 0, 1, 1, pixel).then(() => {
      pending = false;
      waitedFrames = frame - asked;
      show(pixel[0]);
    });
  };

  const bar = overlay(container, 'controls');
  choiceButtons(buttonGroup(bar), [
    { html: '<code>readRenderTargetPixels</code>', select: () => (asyncMode = false) },
    { html: '<code>readRenderTargetPixelsAsync</code>', select: () => (asyncMode = true) },
  ]);
  controls.update(); // aims the camera at its target now, so the first pick sees the boxes
  pointerSpot(container, canvas, bar, pick, { across: 0.42, down: 0.52 });

  const readout = overlay(container, 'readout');
  onFrame(() => {
    frame += 1;
    readout.textContent = [
      asyncMode
        ? 'await renderer.readRenderTargetPixelsAsync(pickTarget, 0, 0, 1, 1, pixel)'
        : 'renderer.readRenderTargetPixels(pickTarget, 0, 0, 1, 1, pixel)',
      `under the pointer: ${picked === 0 ? 'nothing' : `box ${picked}`}   (pixel [${Array.from(pixel).join(', ')}])`,
      asyncMode
        ? `the answer arrived ${waitedFrames} frame${waitedFrames === 1 ? '' : 's'} after asking; JavaScript kept running meanwhile`
        : 'JavaScript stopped at that line until the GPU had finished everything queued before it',
    ].join('\n');
  });
};
