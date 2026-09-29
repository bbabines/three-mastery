// Scenes for the light types and falloff page. The README places each one with <div data-scene="name">.
import { ball, choiceButtons, COLORS, formatNumber, line, overlay, screenColor, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const falloff: SceneSetup = (harness) => {
  const { scene, camera, controls, container, onFrame } = harness;
  camera.position.set(1.7, 1.9, 3.1);
  controls.target.set(0, 1.35, 0);
  controls.update(); // aim now: the first readout reads the screen before the first render
  const sky = scene.children.find((child) => child instanceof THREE.HemisphereLight);
  if (sky) sky.visible = false; // only this scene's lights

  const block = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 0.9), new THREE.MeshStandardMaterial({ color: COLORS.white, roughness: 0.9 }));
  block.position.y = 0.2;
  const top = new THREE.Vector3(0, 0.4, 0);
  const lamp = new THREE.PointLight(0xffffff, 3);
  const sun = new THREE.DirectionalLight(0xffffff, 3);
  sun.target.position.copy(top);
  const ambient = new THREE.AmbientLight(0xffffff, 0);
  const bulb = ball(COLORS.yellow, 1, 0.08);
  (bulb.material as THREE.MeshStandardMaterial).emissive.set(COLORS.yellow);
  const drop = line(COLORS.yellow, 0.5);
  scene.add(block, lamp, sun, sun.target, ambient, bulb, drop);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let height = 1;
  let point = true;
  let measure = true;

  onFrame(() => {
    if (!measure) return;
    measure = false;
    const seen = screenColor(harness, top.clone().add(new THREE.Vector3(0.2, 0, 0.2)));
    readout.innerHTML = [
      point
        ? `lamp: a PointLight ${formatNumber(height)} above the block; light reaching it: 1 / ${formatNumber(height)}² = ${formatNumber(1 / height ** 2)} of what it gets at 1`
        : `sun: a DirectionalLight ${formatNumber(height)} above the block; light reaching it: the same at any height`,
      `ambient.intensity = ${formatNumber(ambient.intensity)}`,
      `the block's top on screen: ${seen} <span style="display:inline-block;width:2.2em;height:0.9em;vertical-align:middle;background:${seen}"></span>`,
    ].join('\n');
  });

  const update = () => {
    const position = top.clone().add(new THREE.Vector3(0, height, 0));
    lamp.position.copy(position);
    sun.position.copy(position);
    lamp.visible = point;
    sun.visible = !point;
    bulb.position.copy(position);
    setLine(drop, position, top);
    measure = true;
  };
  choiceButtons(controlsBar, [
    { html: 'PointLight', select: () => ((point = true), update()) },
    { html: 'DirectionalLight', select: () => ((point = false), update()) },
  ]);
  slider(controlsBar, 'Light height', { min: 0.5, max: 2.5, step: 0.25, value: height }, (value) => {
    height = value;
    update();
  });
  slider(controlsBar, 'Ambient', { min: 0, max: 1.5, step: 0.25, value: 0 }, (value) => {
    ambient.intensity = value;
    measure = true;
  });
  controls.addEventListener('change', () => (measure = true));
};
