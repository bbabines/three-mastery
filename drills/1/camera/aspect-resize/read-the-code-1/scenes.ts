// Scenes for the aspect and resize page. The README places each one with <div data-scene="name">.
import { cameraView, choiceButtons, COLORS, formatNumber, overlay, showCamera, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const HEIGHT = 240; // the stand-in canvas's height, in pixels
const START_WIDTH = 360;

export const stretch: SceneSetup = (harness) => {
  const { scene, camera, controls, container } = harness;
  camera.position.set(4.4, 3.4, 5.4);
  controls.target.set(0, 0.9, 0.8);

  const eye = new THREE.PerspectiveCamera(45, START_WIDTH / HEIGHT, 0.3, 5);
  eye.position.set(0, 1.1, 3.6);
  eye.lookAt(0, 0.8, 0);
  const helper = showCamera(eye);
  scene.add(eye, helper);

  const round = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 16), new THREE.MeshStandardMaterial({ color: COLORS.yellow }));
  round.position.set(-0.8, 0.8, 0);
  const cube = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  cube.position.set(0.8, 0.4, 0);
  scene.add(round, cube);
  const view = cameraView(harness, eye, [helper]);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let width = START_WIDTH;
  let updateCamera = false;

  const update = () => {
    view.setSize(width, HEIGHT); // stands in for renderer.setSize(width, HEIGHT, false)
    if (updateCamera) {
      eye.aspect = width / HEIGHT;
      eye.updateProjectionMatrix();
    } else {
      eye.aspect = START_WIDTH / HEIGHT; // still the shape from before the resize
      eye.updateProjectionMatrix();
    }
    helper.update();
    readout.innerHTML = [
      `renderer.setSize(${width}, ${HEIGHT}, false);   canvas ${formatNumber(width / HEIGHT)} : 1`,
      updateCamera
        ? `camera.aspect = ${width} / ${HEIGHT};\ncamera.updateProjectionMatrix();`
        : `// camera.aspect is still ${formatNumber(START_WIDTH / HEIGHT)}`,
      updateCamera || width === START_WIDTH ? 'Round stays round.' : 'Stretched to fit: the ball is an oval.',
    ].join('\n');
  };

  choiceButtons(controlsBar, [
    {
      html: '<code>setSize</code> only',
      select: () => {
        updateCamera = false;
        update();
      },
    },
    {
      html: '<code>setSize</code> + <code>aspect</code>',
      select: () => {
        updateCamera = true;
        update();
      },
    },
  ]);
  slider(controlsBar, 'Canvas width', { min: 200, max: 720, step: 40, value: width }, (value) => {
    width = value;
    update();
  });
};
