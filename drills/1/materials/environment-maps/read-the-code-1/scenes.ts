// Scenes for the environment maps and IBL page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, formatNumber, label, overlay, roomEnvironment, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// A chrome ball and a blue painted ball, with the harness's sky light off: nothing but the
// environment lights them.
function twoBalls(scene: THREE.Scene) {
  for (const child of scene.children) {
    if (child instanceof THREE.HemisphereLight) child.visible = false;
    if (child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper) child.visible = false; // they'd show in the background
  }
  const chrome = new THREE.Mesh(new THREE.SphereGeometry(0.5, 96, 48), new THREE.MeshStandardMaterial({ color: '#f2f3f5', metalness: 1, roughness: 0.05 }));
  chrome.position.set(-0.6, 1.1, 0);
  const paint = new THREE.Mesh(new THREE.SphereGeometry(0.5, 96, 48), new THREE.MeshStandardMaterial({ color: '#1e3a8a', metalness: 0, roughness: 0.5 }));
  paint.position.set(0.6, 1.1, 0);
  const chromeTag = label('chrome', COLORS.white);
  chromeTag.position.set(-0.6, 1.75, 0);
  const paintTag = label('paint', COLORS.white);
  paintTag.position.set(0.6, 1.75, 0);
  scene.add(chrome, paint, chromeTag, paintTag);
}

export const envOrBackground: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(0, 1.35, 2.7);
  controls.target.set(0, 1.25, 0);
  twoBalls(scene);
  const env = roomEnvironment(renderer);
  const plain = scene.background; // the harness's dark gray

  const readout = overlay(container, 'readout');
  const options = [
    { name: 'neither', environment: false, background: false },
    { name: 'background only', environment: false, background: true },
    { name: 'environment only', environment: true, background: false },
    { name: 'both', environment: true, background: true },
  ];
  choiceButtons(
    overlay(container, 'controls'),
    options.map((option) => ({
      html: option.name,
      select: () => {
        scene.environment = option.environment ? env : null;
        scene.background = option.background ? env : plain;
        readout.textContent = [
          `scene.environment = ${option.environment ? 'env' : 'null'}`,
          `scene.background = ${option.background ? 'env' : "new Color('#15171c')"}`,
          option.environment
            ? 'lit by the room, and the chrome reflects it'
            : `nothing lights them${option.background ? ': the room shows behind, but a background lights nothing' : ''}`,
        ].join('\n');
      },
    })),
  );
};

export const turnEnvironment: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(0, 1.35, 2.7);
  controls.target.set(0, 1.25, 0);
  twoBalls(scene);
  scene.environment = roomEnvironment(renderer);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let turn = 0;
  const update = () => {
    scene.environmentRotation.y = THREE.MathUtils.degToRad(turn);
    readout.textContent = [
      `scene.environmentRotation.y = ${formatNumber(THREE.MathUtils.degToRad(turn))}   (${turn}°)`,
      `scene.environmentIntensity = ${formatNumber(scene.environmentIntensity)}`,
      'reflections and lighting turn and dim together, on every material at once',
    ].join('\n');
  };
  slider(controlsBar, 'turn', { min: -180, max: 180, step: 15, value: turn }, (value) => {
    turn = value;
    update();
  });
  slider(controlsBar, 'intensity', { min: 0, max: 2, step: 0.25, value: 1 }, (value) => {
    scene.environmentIntensity = value;
    update();
  });
  update();
};
