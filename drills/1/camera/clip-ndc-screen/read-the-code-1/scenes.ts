// Scenes for the clip space, NDC, screen page. The README places each one with <div data-scene="name">.
import { ball, choiceButtons, COLORS, formatNumber, line, overlay, screenTag, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const f = (n: number) => formatNumber(n, 2);

export const trip: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(0.6, 2, 4.6);
  controls.target.set(0.3, 1.2, 0);

  const target = ball(COLORS.yellow);
  const drop = line(COLORS.yellow, 0.4); // a faint line to the floor makes the height readable
  scene.add(target, drop);
  const tag = screenTag(container, 'HTML label', COLORS.yellow);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  const values = { x: 1, y: 1.5, z: 0 };
  const clip = new THREE.Vector4();
  const canvas = renderer.domElement;

  // Runs inside every render, after three.js has refreshed the camera, so the label never lags.
  scene.onBeforeRender = () => {
    target.position.set(values.x, values.y, values.z);
    target.updateMatrixWorld(); // the scene's matrices were refreshed before this ran
    setLine(drop, target.position, new THREE.Vector3(values.x, 0, values.z));

    clip.set(values.x, values.y, values.z, 1).applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix);
    const ndc = new THREE.Vector3(clip.x / clip.w, clip.y / clip.w, clip.z / clip.w);
    const x = ((ndc.x + 1) / 2) * canvas.clientWidth;
    const y = ((1 - ndc.y) / 2) * canvas.clientHeight;
    const onScreen = Math.abs(ndc.x) <= 1 && Math.abs(ndc.y) <= 1 && Math.abs(ndc.z) <= 1;
    tag.hidden = !onScreen;
    tag.style.left = `${x}px`;
    tag.style.top = `${y}px`;

    readout.innerHTML = [
      `clip    (${f(clip.x)}, ${f(clip.y)}, ${f(clip.z)}, ${f(clip.w)})   w: depth in front`,
      `NDC     (${f(ndc.x)}, ${f(ndc.y)}, ${f(ndc.z)})   clip ÷ w`,
      onScreen
        ? `pixels  (${Math.round(x)}, ${Math.round(y)})   from the canvas's top-left`
        : `off screen: ${Math.abs(ndc.x) > 1 ? 'x' : Math.abs(ndc.y) > 1 ? 'y' : 'z'} is outside −1 to 1`,
    ].join('\n');
  };

  slider(sliders, 'x', { min: -4, max: 4, step: 0.5, value: values.x }, (value) => (values.x = value));
  slider(sliders, 'y', { min: 0.5, max: 3, step: 0.25, value: values.y }, (value) => (values.y = value));
  slider(sliders, 'z', { min: -4, max: 4, step: 0.5, value: values.z }, (value) => (values.z = value));
};

export const labelFlip: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0, 1.6, 6);
  controls.target.set(0, 1.4, 0);

  const part = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  scene.add(part);
  const tag = screenTag(container, 'price tag', COLORS.yellow);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const canvas = renderer.domElement;
  let flip = true;
  let speed = 1;
  let time = 0;

  onFrame((delta) => {
    time += delta * speed;
    part.position.set(-1.2, 1.4 + Math.sin(time * 1.5) * 1.1, 0);
    part.rotation.y = time * 0.5;
  });

  scene.onBeforeRender = () => {
    const ndc = part.position.clone().project(camera);
    const x = ((ndc.x + 1) / 2) * canvas.clientWidth;
    const y = flip ? ((1 - ndc.y) / 2) * canvas.clientHeight : ((ndc.y + 1) / 2) * canvas.clientHeight;
    tag.style.left = `${x}px`;
    tag.style.top = `${y}px`;
    readout.innerHTML = [
      `ndc.y  ${f(ndc.y)}   up is positive`,
      flip
        ? `label.style.top = (1 - ndc.y) / 2 * height   ${Math.round(y)}px`
        : `label.style.top = (ndc.y + 1) / 2 * height   ${Math.round(y)}px`,
      flip ? 'The tag rides on the box.' : 'Mirrored: the tag moves down as the box moves up.',
    ].join('\n');
  };

  choiceButtons(controlsBar, [
    {
      html: '<code>(1 - ndc.y) / 2 * height</code>',
      select: () => (flip = true),
    },
    {
      html: '<code>(ndc.y + 1) / 2 * height</code>',
      select: () => (flip = false),
    },
  ]);
  slider(controlsBar, 'speed', { min: 0, max: 1, step: 0.25, value: speed }, (value) => (speed = value));
};
