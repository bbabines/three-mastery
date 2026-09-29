// Scenes for the fit to bounds page. The README places each one with <div data-scene="name">.
import { cameraView, choiceButtons, COLORS, formatNumber, overlay, showCamera, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const PICTURE_HEIGHT = 300;
const ASPECTS = [0.5, 0.75, 1, 1.5, 2];
const FROM = new THREE.Vector3(0.35, 0.3, 1).normalize(); // the way back from the model to the camera

// A wide, low shelf unit: the kind of model a tall screen cuts off at the ends.
function shelfUnit() {
  const shelf = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: COLORS.blue });
  for (const x of [-0.97, 0.97]) {
    const side = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.8, 0.5), wood);
    side.position.set(x, 0.45, 0);
    shelf.add(side);
  }
  for (const y of [0.08, 0.45, 0.82]) {
    const board = new THREE.Mesh(new THREE.BoxGeometry(2, 0.05, 0.5), wood);
    board.position.set(0, y, 0);
    shelf.add(board);
  }
  const boxes = new THREE.MeshStandardMaterial({ color: COLORS.orange });
  for (const [x, y] of [
    [-0.6, 0.23],
    [0.1, 0.23],
    [0.55, 0.6],
    [-0.3, 0.6],
  ]) {
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.25, 0.3), boxes);
    box.position.set(x, y, 0);
    shelf.add(box);
  }
  return shelf;
}

export const fitView: SceneSetup = (harness) => {
  const { scene, camera, controls, container } = harness;
  camera.position.set(7.6, 5.4, 7.4);
  controls.target.set(0.9, 0.6, 2.6);

  const model = shelfUnit();
  scene.add(model);
  const eye = new THREE.PerspectiveCamera(40, 1, 0.1, 20);
  const helper = showCamera(eye);
  scene.add(eye, helper);
  const view = cameraView(harness, eye, [helper]);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const box = new THREE.Box3().setFromObject(model);
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  const corners = [0, 1, 2, 3, 4, 5, 6, 7].map(
    (i) => new THREE.Vector3(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z),
  );
  let aspect = 0.5;
  let narrower = false;

  const update = () => {
    eye.aspect = aspect;
    const vertical = THREE.MathUtils.degToRad(eye.fov);
    const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * eye.aspect);
    const angle = narrower ? Math.min(vertical, horizontal) : vertical;
    const distance = sphere.radius / Math.sin(angle / 2);
    eye.position.copy(sphere.center).addScaledVector(FROM, distance);
    eye.lookAt(sphere.center);
    eye.far = distance + sphere.radius + 0.5; // just past the model, so the outline stays short
    eye.updateProjectionMatrix();
    helper.update();
    eye.updateMatrixWorld(); // the scene projects with the camera before the next render refreshes it
    view.setSize(Math.round(PICTURE_HEIGHT * aspect), PICTURE_HEIGHT);

    // Where the shelf's corners land on the view: past ±1 means cut off.
    const ndc = corners.map((corner) => corner.clone().project(eye));
    const cutSides = ndc.some((v) => Math.abs(v.x) > 1);
    const cutTop = ndc.some((v) => Math.abs(v.y) > 1);
    const degrees = (radians: number) => Math.round(THREE.MathUtils.radToDeg(radians));
    readout.innerHTML = [
      narrower
        ? `sphere.radius / Math.sin(Math.min(vertical, horizontal) / 2)`
        : `sphere.radius / Math.sin(vertical / 2)`,
      `distance ${formatNumber(distance, 2)}   angles: ${degrees(vertical)}° top to bottom, ${degrees(horizontal)}° across`,
      cutSides ? 'The ends of the shelf are cut off.' : cutTop ? 'The top and bottom are cut off.' : 'The whole shelf fits.',
    ].join('\n');
  };

  choiceButtons(controlsBar, [
    {
      html: 'Vertical <code>fov</code> only',
      select: () => {
        narrower = false;
        update();
      },
    },
    {
      html: 'The narrower angle',
      select: () => {
        narrower = true;
        update();
      },
    },
  ]);
  slider(controlsBar, 'Screen shape', { min: 0, max: ASPECTS.length - 1, step: 1, value: ASPECTS.indexOf(aspect) }, (value) => {
    aspect = ASPECTS[value];
    update();
  });
};
