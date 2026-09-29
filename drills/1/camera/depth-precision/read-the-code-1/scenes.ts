// Scenes for the depth precision page. The README places each one with <div data-scene="name">.
import { COLORS, formatNumber, label, line, overlay, setLine, showCamera, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// The value the depth buffer stores for a spot: its NDC z, squeezed from −1 to 1 into 0 to 1.
function depthValue(camera: THREE.Camera, spot: THREE.Vector3) {
  return (spot.clone().project(camera).z + 1) / 2;
}

const STEPS = 2 ** 24 - 1; // a 24-bit depth buffer
const NEAR_CHOICES = [0.01, 0.05, 0.1, 0.25, 0.5, 1];
const RULER_FAR = 10;
const BAR_HEIGHT = 2; // a depth value of 1 draws this tall

export const depthRuler: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.8, 3.4, 7.8);
  controls.target.set(0.6, 1, 0);

  // The camera sits at x = −4 and looks along +X, so each bar's distance in front of it is x + 4.
  const eye = new THREE.PerspectiveCamera(35, 1.5, 0.1, RULER_FAR);
  eye.position.set(-4, 1, 0);
  eye.rotation.y = -Math.PI / 2;
  const helper = showCamera(eye);
  scene.add(eye, helper);

  const distances = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const barMaterial = new THREE.MeshStandardMaterial({ color: COLORS.blue });
  const bars = distances.map((distance) => {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1, 0.3), barMaterial);
    bar.position.set(-4 + distance, 0, 0);
    scene.add(bar);
    return bar;
  });
  const top = line(COLORS.gray);
  setLine(top, new THREE.Vector3(-3.3, BAR_HEIGHT + 0.05, 0), new THREE.Vector3(5.3, BAR_HEIGHT + 0.05, 0));
  const topTag = label('1: the far plane', COLORS.gray);
  topTag.position.set(4.3, BAR_HEIGHT + 0.35, 0);
  const firstTag = label('1 unit', COLORS.white);
  firstTag.position.set(-3, -0.25, 0.4);
  const lastTag = label('9 units', COLORS.white);
  lastTag.position.set(5, -0.25, 0.4);
  scene.add(top, topTag, firstTag, lastTag);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  let near = 0.1;

  const update = () => {
    eye.near = near;
    eye.updateProjectionMatrix();
    helper.update();
    eye.updateMatrixWorld(); // the scene projects with the camera before the next render refreshes it

    const values = distances.map((distance) => depthValue(eye, new THREE.Vector3(-4 + distance, 1, 0)));
    bars.forEach((bar, i) => {
      const height = Math.max(values[i], 0.005) * BAR_HEIGHT; // a sliver still shows at 0
      bar.scale.y = height;
      bar.position.y = height / 2 + 0.05;
    });
    readout.innerHTML = [
      `camera.near = ${near}   (far ${RULER_FAR})`,
      `depth value at 1 unit    ${formatNumber(values[0], 3)}`,
      `depth value at 9 units   ${formatNumber(values[8], 3)}`,
      `from 1 to 9 units: ${formatNumber((values[8] - values[0]) * 100, 1)}% of all the steps`,
    ].join('\n');
  };
  slider(sliders, 'camera.near', { min: 0, max: NEAR_CHOICES.length - 1, step: 1, value: NEAR_CHOICES.indexOf(near) }, (value) => {
    near = NEAR_CHOICES[value];
    update();
  });
  update();
};

const FIGHT_NEAR = [0.0005, 0.001, 0.005, 0.01, 0.1, 0.5];
const FIGHT_FAR = [100, 1000, 10000, 100000];
const GAP = 0.001; // how far the sticker sits in front of the wall

export const zFight: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(1.5, 1.5, 5.4);
  controls.target.set(0, 1.25, 0);

  const wall = new THREE.Mesh(new THREE.BoxGeometry(3, 2, 0.2), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  wall.position.set(0, 1.1, 0);
  const sticker = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.1), new THREE.MeshStandardMaterial({ color: COLORS.yellow }));
  sticker.position.set(0, 1.1, 0.1 + GAP); // the wall's front face is at z = 0.1
  // Drawn before the wall, so where the two round to the same depth, the wall wins: the worst case,
  // and what happens whenever the draw order isn't in the sticker's favor.
  sticker.renderOrder = -1;
  const stickerTag = label('sticker, 0.001 in front', COLORS.yellow);
  stickerTag.position.set(0, 2.45, 0.1);
  scene.add(wall, sticker, stickerTag);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  let near = 0.001;
  let far = 100;
  const front = new THREE.Vector3();
  const behind = new THREE.Vector3();

  onFrame(() => {
    camera.near = near;
    camera.far = far;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();

    // The sticker's center and the spot on the wall just behind it.
    sticker.getWorldPosition(front);
    behind.copy(front).setZ(front.z - GAP);
    const apart = (depthValue(camera, behind) - depthValue(camera, front)) * STEPS;
    readout.innerHTML = [
      `camera.near = ${near}; camera.far = ${far};`,
      `sticker and wall: about ${formatNumber(apart, apart < 10 ? 1 : 0)} depth steps apart`,
      apart < 1 ? 'Less than a step: they fight.' : apart < 4 ? 'Barely enough: it may flicker at a steep angle.' : 'Plenty of steps: clean.',
    ].join('\n');
  });

  slider(sliders, 'camera.near', { min: 0, max: FIGHT_NEAR.length - 1, step: 1, value: FIGHT_NEAR.indexOf(near) }, (value) => {
    near = FIGHT_NEAR[value];
  });
  slider(sliders, 'camera.far', { min: 0, max: FIGHT_FAR.length - 1, step: 1, value: FIGHT_FAR.indexOf(far) }, (value) => {
    far = FIGHT_FAR[value];
  });
};
