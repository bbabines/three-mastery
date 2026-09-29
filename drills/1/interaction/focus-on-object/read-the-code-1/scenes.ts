// Scenes for the focus on object page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, formatNumber, formatVector, label, LABEL_LIFT, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const focus: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  const START_POSITION = new THREE.Vector3(0.6, 2.4, 5.4);
  const START_TARGET = new THREE.Vector3(0, 1, 0);
  camera.position.copy(START_POSITION);
  controls.target.copy(START_TARGET);
  controls.enableDamping = false; // no glide, so every t shows exactly where the camera is
  controls.update();

  // A shelf unit with three parts of different sizes.
  const frame = new THREE.MeshStandardMaterial({ color: COLORS.gray });
  for (const x of [-1.5, 1.5]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.2, 0.5), frame);
    post.position.set(x, 1.1, 0);
    scene.add(post);
  }
  for (const y of [0.6, 1.4]) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(3, 0.06, 0.5), frame);
    plank.position.set(0, y, 0);
    scene.add(plank);
  }
  const parts: THREE.Mesh[] = [];
  const add = (name: string, geometry: THREE.BufferGeometry, color: string, x: number, shelfY: number) => {
    geometry.computeBoundingBox();
    const part = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color }));
    part.position.set(x, shelfY + 0.03 - geometry.boundingBox!.min.y, 0);
    part.name = name;
    scene.add(part);
    parts.push(part);
    return part;
  };
  add('bin', new THREE.BoxGeometry(0.4, 0.3, 0.35), COLORS.orange, 0.8, 1.4);
  add('drum', new THREE.CylinderGeometry(0.18, 0.18, 0.45, 24), COLORS.green, -0.7, 0.6);
  add('box', new THREE.BoxGeometry(0.7, 0.45, 0.4), COLORS.blue, 0.6, 0.6);
  const hint = label('double-click a part', COLORS.white);
  hint.position.set(0, 2.2, 0).add(LABEL_LIFT);
  scene.add(hint);

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const fromPosition = new THREE.Vector3();
  const fromTarget = new THREE.Vector3();
  const toPosition = new THREE.Vector3();
  const toTarget = new THREE.Vector3();
  const sphere = new THREE.Sphere();
  const box = new THREE.Box3();
  const center = new THREE.Vector3();
  let focused = parts[0];
  let both = true;
  let t = 0;

  // The view that fits the part's bounding sphere, backing off along the start view's direction.
  const plan = (part: THREE.Mesh, fromPos: THREE.Vector3, fromTgt: THREE.Vector3) => {
    focused = part;
    fromPosition.copy(fromPos);
    fromTarget.copy(fromTgt);
    box.setFromObject(part).getBoundingSphere(sphere);
    const vertical = THREE.MathUtils.degToRad(camera.fov);
    const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * camera.aspect);
    const distance = (1.4 * sphere.radius) / Math.sin(Math.min(vertical, horizontal) / 2);
    const back = fromPos.clone().sub(fromTgt).normalize();
    toTarget.copy(sphere.center);
    toPosition.copy(sphere.center).addScaledVector(back, distance);
  };

  const apply = () => {
    camera.position.lerpVectors(fromPosition, toPosition, t);
    if (both) controls.target.lerpVectors(fromTarget, toTarget, t);
    else controls.target.copy(fromTarget);
    controls.update();
    camera.updateMatrixWorld();
    const ndc = focused.getWorldPosition(center).project(camera);
    const centered = Math.abs(ndc.x) < 0.05 && Math.abs(ndc.y) < 0.08 && ndc.z < 1;
    readout.textContent = [
      `camera.position.lerpVectors(fromPosition, toPosition, ${formatNumber(t)})`,
      both ? `controls.target.lerpVectors(fromTarget, toTarget, ${formatNumber(t)})` : '// controls.target stays where it was',
      `controls.target ${formatVector(controls.target, 2)}   focusing on the ${focused.name}`,
      t === 0
        ? 'Slide t, or double-click a part.'
        : t < 1
        ? 'On the way.'
        : centered
          ? `The ${focused.name} is centered, and orbits will circle it.`
          : `The camera still looks at the old target: the ${focused.name} is off to the side.`,
    ].join('\n');
  };

  // A double-click animates a focus from the current view, over 0.8 seconds.
  const timer = new THREE.Timer(); // its own, so it runs even while the page is in a hidden tab
  let animating = false;
  const canvas = renderer.domElement;
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  canvas.addEventListener('dblclick', (event) => {
    const rect = canvas.getBoundingClientRect();
    ndc.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(parts)[0];
    if (!hit) return;
    plan(hit.object as THREE.Mesh, camera.position, controls.target);
    t = 0;
    animating = true;
    controls.enabled = false;
  });
  onFrame(() => {
    const delta = timer.update().getDelta();
    if (!animating) return;
    t = Math.min(1, t + delta / 0.8);
    apply();
    if (t === 1) {
      animating = false;
      controls.enabled = true;
    }
  });

  plan(parts[0], START_POSITION, START_TARGET);
  const tSlider = document.createElement('div'); // placeholder so the slider sits after the buttons
  choiceButtons(bar, [
    { html: 'Move the camera and the target', select: () => ((both = true), apply()) },
    { html: 'Move the camera only', select: () => ((both = false), apply()) },
  ]);
  bar.append(tSlider);
  slider(tSlider, 't', { min: 0, max: 1, step: 0.05, value: t }, (value) => {
    animating = false;
    plan(parts[0], START_POSITION, START_TARGET);
    t = value;
    apply();
  });
};
