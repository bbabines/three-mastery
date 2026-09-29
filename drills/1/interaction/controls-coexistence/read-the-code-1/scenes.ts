// Scenes for the controls coexistence page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, formatNumber, formatVector, label, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

export const bothMove: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  const VIEW = new THREE.Vector3(1.2, 2.5, 4.4);
  const TARGET = new THREE.Vector3(0, 0.5, 0);
  const CRATE_START = new THREE.Vector3(-0.8, 0.4, 0);
  camera.position.copy(VIEW);
  controls.target.copy(TARGET);

  const crate = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  crate.position.copy(CRATE_START);
  scene.add(crate);
  // Two shelves behind, so an orbit is easy to see.
  for (const x of [-1.8, 1.8]) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1, 1.3, 0.4), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
    shelf.position.set(x, 0.65, -2);
    scene.add(shelf);
  }
  const shelfTag = label('shelves', COLORS.blue);
  shelfTag.position.set(1.8, 1.75, -2); // over the right-hand shelf, clear of the readout and the crate
  scene.add(shelfTag);

  const gizmo = new TransformControls(camera, renderer.domElement);
  gizmo.attach(crate);
  gizmo.setSize(0.8);
  scene.add(gizmo.getHelper());

  let wired = false;
  gizmo.addEventListener('dragging-changed', (event) => {
    if (wired) controls.enabled = !event.value;
  });

  // How far the view has orbited since the last drag began, from a real drag or the replay.
  let orbitStart = 0;
  let orbited = 0;
  gizmo.addEventListener('mouseDown', () => (orbitStart = controls.getAzimuthalAngle()));

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  onFrame(() => {
    if (gizmo.dragging) orbited = Math.abs(controls.getAzimuthalAngle() - orbitStart);
    const degrees = THREE.MathUtils.radToDeg(orbited);
    readout.textContent = [
      wired ? "gizmo.addEventListener('dragging-changed', (e) => (controls.enabled = !e.value))" : '// nothing connects the gizmo and the orbit',
      `crate.position ${formatVector(crate.position, 2)}`,
      degrees < 0.5 ? 'The view stayed put during the drag.' : `The view orbited ${formatNumber(degrees, 0)}° during the drag, too.`,
    ].join('\n');
  });

  // The replay: a drag of the X arrow, a tenth of the canvas to the right. The gizmo moves the crate;
  // with nothing wired, OrbitControls hears the same pointer and turns the view as a drag that far
  // would: a full circle per canvas height.
  let t = 0;
  const replay = () => {
    controls.enableDamping = false;
    camera.position.copy(VIEW);
    controls.target.copy(TARGET);
    controls.update();
    crate.position.copy(CRATE_START);
    crate.position.x += 1.2 * t;
    const pixels = 0.1 * renderer.domElement.clientWidth * t;
    const angle = wired ? 0 : (2 * Math.PI * pixels) / renderer.domElement.clientHeight;
    if (angle > 0) controls.rotateLeft(angle);
    orbited = angle;
    controls.enableDamping = true;
  };

  choiceButtons(bar, [
    { html: 'Nothing wired', select: () => ((wired = false), (controls.enabled = true), replay()) },
    { html: '<code>dragging-changed</code> turns the orbit off', select: () => ((wired = true), replay()) },
  ]);
  slider(bar, 'Drag the X arrow', { min: 0, max: 1, step: 0.05, value: t }, (value) => {
    t = value;
    replay();
  });
};
