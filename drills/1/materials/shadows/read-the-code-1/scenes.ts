// Scenes for the shadows page. The README places each one with <div data-scene="name">.
import { buttonGroup, choiceButtons, COLORS, formatNumber, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const shadowMap: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(1.2, 1.5, 2.2);
  controls.target.set(0.35, 0.4, 0);
  renderer.shadowMap.enabled = true; // before the first render, so every material is built with shadows
  for (const child of scene.children) {
    if (child instanceof THREE.HemisphereLight) child.intensity = 0.6;
    if (child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper) child.visible = false;
  }

  // A DoubleSide floor that casts shadows as well as receiving them, so it can shade itself: that's
  // where shadow acne shows up. (three.js draws single-sided meshes' back faces into the shadow map,
  // which spares most closed shapes from acne.)
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 12),
    new THREE.MeshStandardMaterial({ color: '#9aa0ab', roughness: 0.95, side: THREE.DoubleSide }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  floor.castShadow = true;
  // A stool: a round seat on three legs.
  const stool = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: COLORS.orange, roughness: 0.6 });
  const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.08, 48), wood);
  seat.position.y = 0.8;
  stool.add(seat);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.8, 16), wood);
    leg.position.set(Math.cos(a) * 0.3, 0.4, Math.sin(a) * 0.3);
    stool.add(leg);
  }
  stool.traverse((child) => {
    child.castShadow = true; // castShadow on the group alone isn't passed down
    child.receiveShadow = true;
  });
  scene.add(floor, stool);

  const sun = new THREE.DirectionalLight(0xffffff, 3);
  sun.position.set(-2.5, 3, 1.2);
  sun.castShadow = true;
  sun.shadow.camera.near = 0.5; // fit the depth range too: bias is measured across it
  sun.shadow.camera.far = 10;
  const helper = new THREE.CameraHelper(sun.shadow.camera);
  scene.add(sun, helper);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const state = { half: 5, mapSize: 512, bias: 0 };
  const biases = [
    { html: 'no bias', bias: 0, normalBias: 0, note: 'stripes of shadow acne across the floor' },
    { html: 'normalBias 0.02', bias: 0, normalBias: 0.02, note: 'a small nudge: acne gone, shadows still touching the legs' },
    { html: 'bias -0.02', bias: -0.02, normalBias: 0, note: 'too much: shadows start away from the legs (peter-panning)' },
  ];

  const update = () => {
    const shadowCamera = sun.shadow.camera;
    shadowCamera.left = shadowCamera.bottom = -state.half;
    shadowCamera.right = shadowCamera.top = state.half;
    shadowCamera.updateProjectionMatrix(); // the shadow camera is a camera: changes need this
    helper.update();
    sun.shadow.mapSize.set(state.mapSize, state.mapSize);
    const bias = biases[state.bias];
    sun.shadow.bias = bias.bias;
    sun.shadow.normalBias = bias.normalBias;
    readout.textContent = [
      `sun.shadow.camera: left −${formatNumber(state.half)} to right ${formatNumber(state.half)}   sun.shadow.mapSize: ${state.mapSize} × ${state.mapSize}`,
      `sharpness: ${state.mapSize} pixels over ${formatNumber(state.half * 2)} units = ${formatNumber(state.mapSize / (state.half * 2), 0)} per unit   GPU memory: ${state.mapSize === 512 ? '1×' : '16×'} a 512 map's`,
      `bias ${bias.bias}, normalBias ${bias.normalBias}: ${bias.note}`,
    ].join('\n');
  };

  slider(controlsBar, 'Shadow camera half-width', { min: 1, max: 8, step: 0.5, value: state.half }, (value) => {
    state.half = value;
    update();
  });
  choiceButtons(
    buttonGroup(controlsBar, 'mapSize:'),
    [512, 2048].map((size) => ({
      html: String(size),
      select: () => {
        state.mapSize = size;
        update();
      },
    })),
  );
  choiceButtons(
    buttonGroup(controlsBar),
    biases.map((bias, i) => ({
      html: bias.html,
      select: () => {
        state.bias = i;
        update();
      },
    })),
  );
};
