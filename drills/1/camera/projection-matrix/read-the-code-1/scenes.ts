// Scenes for the projection matrix page. The README places each one with <div data-scene="name">.
import { cameraView, choiceButtons, COLORS, formatNumber, label, overlay, showCamera, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// How tall a box of the given height at `center` looks in the camera's picture, as a share of the
// picture's height.
function shareOfHeight(camera: THREE.Camera, center: THREE.Vector3, height: number) {
  const top = center.clone().setY(center.y + height / 2).project(camera);
  const bottom = center.clone().setY(center.y - height / 2).project(camera);
  return (top.y - bottom.y) / 2;
}

const BOX = 0.6;
const START_FOV = 50;
const FRONT_DEPTH = 2; // how far in front of the camera the blue box sits at the start

export const zoomVsDolly: SceneSetup = (harness) => {
  const { scene, camera, controls, container } = harness;
  camera.position.set(-3.6, 2.6, 3.4);
  controls.target.set(0.5, 0.8, 0.9);

  const eye = new THREE.PerspectiveCamera(START_FOV, 1.5, 0.3, 5);
  const helper = showCamera(eye);

  // Thin signs facing the camera, so their on-screen size depends only on how far away they are.
  const front = new THREE.Mesh(new THREE.BoxGeometry(BOX, BOX, 0.04), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  front.position.set(-0.3, 1, 1);
  const back = new THREE.Mesh(new THREE.BoxGeometry(BOX, BOX, 0.04), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  back.position.set(0.35, 1, 1 - FRONT_DEPTH);
  scene.add(eye, helper, front, back);
  cameraView(harness, eye, [helper]);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let dolly = false;
  let tighter = 0;

  const update = () => {
    // The fov a zoom would use. A dolly keeps fov at 50 and moves in until the blue sign fills the
    // same share of the picture.
    const fov = THREE.MathUtils.lerp(START_FOV, 24, tighter);
    const halfAngle = (degrees: number) => Math.tan(THREE.MathUtils.degToRad(degrees / 2));
    const distance = dolly ? (FRONT_DEPTH * halfAngle(fov)) / halfAngle(START_FOV) : FRONT_DEPTH;
    eye.fov = dolly ? START_FOV : fov;
    eye.updateProjectionMatrix();
    helper.update();
    eye.position.set(0, 1, front.position.z + distance);
    eye.updateMatrixWorld(); // the scene projects with the camera before the next render refreshes it

    const frontShare = shareOfHeight(eye, front.position, BOX);
    const backShare = shareOfHeight(eye, back.position, BOX);
    readout.innerHTML = [
      dolly
        ? `camera.position.z = ${formatNumber(eye.position.z, 1)}; // fov stays ${START_FOV}`
        : `camera.fov = ${formatNumber(fov, 0)};\ncamera.updateProjectionMatrix();`,
      `<span style="color:${COLORS.blue}">■</span> blue sign    ${Math.round(frontShare * 100)}% of the picture's height`,
      `<span style="color:${COLORS.orange}">■</span> orange sign  ${Math.round(backShare * 100)}%, ${formatNumber(backShare / frontShare)} × the blue sign`,
    ].join('\n');
  };

  choiceButtons(controlsBar, [
    {
      html: 'Zoom: smaller <code>fov</code>',
      select: () => {
        dolly = false;
        update();
      },
    },
    {
      html: 'Dolly: move closer',
      select: () => {
        dolly = true;
        update();
      },
    },
  ]);
  slider(controlsBar, 'frame tighter', { min: 0, max: 1, step: 0.1, value: tighter }, (value) => {
    tighter = value;
    update();
  });
};

const RACK = new THREE.Vector3(0.5, 0.9, 0.5);
const SPACING = 1.3;
const LOOK_AT = new THREE.Vector3(0, RACK.y / 2, 0);
// The camera sits on this diagonal, looking back at the middle rack: an isometric-style view.
const DIAGONAL = new THREE.Vector3(1, 0.85, 1).normalize();

export const perspectiveVsOrtho: SceneSetup = (harness) => {
  const { scene, camera, controls, container } = harness;
  camera.position.set(6.2, 3.6, -3.4);
  controls.target.set(1.2, 1.2, 1.2);

  // A 3 × 3 floor of racks, standing just above the floor grid.
  const rackMaterial = new THREE.MeshStandardMaterial({ color: COLORS.blue });
  const racks: THREE.Mesh[] = [];
  for (const x of [-1, 0, 1]) {
    for (const z of [-1, 0, 1]) {
      const rack = new THREE.Mesh(new THREE.BoxGeometry(RACK.x, RACK.y, RACK.z), rackMaterial);
      rack.position.set(x * SPACING, RACK.y / 2 + 0.05, z * SPACING);
      racks.push(rack);
      scene.add(rack);
    }
  }
  const nearest = racks[racks.length - 1]; // at (+1, +1): closest to the camera
  const farthest = racks[0]; // at (−1, −1)

  const perspective = new THREE.PerspectiveCamera(40, 1.5, 0.3, 10);
  const orthographic = new THREE.OrthographicCamera(-2.7, 2.7, 1.8, -1.8, 0.3, 10);
  const perspectiveHelper = showCamera(perspective);
  const orthographicHelper = showCamera(orthographic);
  const tag = label('camera', COLORS.gray);
  scene.add(perspective, orthographic, perspectiveHelper, orthographicHelper, tag);
  const view = cameraView(harness, perspective, [perspectiveHelper, orthographicHelper, tag]);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let useOrtho = false;
  let distance = 5;

  const update = () => {
    const active = useOrtho ? orthographic : perspective;
    for (const cam of [perspective, orthographic]) {
      cam.position.copy(DIAGONAL).multiplyScalar(distance).add(LOOK_AT);
      cam.lookAt(LOOK_AT);
      cam.far = distance + 3;
      cam.updateProjectionMatrix();
      cam.visible = cam === active;
      cam.updateMatrixWorld(); // the scene projects with the camera before the next render refreshes it
    }
    perspectiveHelper.update();
    orthographicHelper.update();
    perspectiveHelper.visible = !useOrtho;
    orthographicHelper.visible = useOrtho;
    tag.position.copy(active.position).add(new THREE.Vector3(0, 0.45, 0));
    view.setSubject(active);

    const nearShare = shareOfHeight(active, nearest.position, RACK.y);
    const farShare = shareOfHeight(active, farthest.position, RACK.y);
    readout.innerHTML = [
      useOrtho
        ? `new OrthographicCamera(-2.7, 2.7, 1.8, -1.8, 0.3, ${formatNumber(active.far, 1)})`
        : `new PerspectiveCamera(40, 1.5, 0.3, ${formatNumber(active.far, 1)})`,
      `nearest rack   ${Math.round(nearShare * 100)}% of the picture's height`,
      `farthest rack  ${Math.round(farShare * 100)}%, ${formatNumber(farShare / nearShare)} × the nearest`,
    ].join('\n');
  };

  choiceButtons(controlsBar, [
    {
      html: '<code>PerspectiveCamera</code>',
      select: () => {
        useOrtho = false;
        update();
      },
    },
    {
      html: '<code>OrthographicCamera</code>',
      select: () => {
        useOrtho = true;
        update();
      },
    },
  ]);
  slider(controlsBar, 'camera distance', { min: 4, max: 7, step: 0.5, value: distance }, (value) => {
    distance = value;
    update();
  });
};
