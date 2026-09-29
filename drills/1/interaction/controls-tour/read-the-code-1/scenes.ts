// Scenes for the controls tour. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, formatNumber, formatVector, label, LABEL_LIFT, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

type Mode = 'orbit' | 'transform' | 'look';

export const members: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  const ORBIT_VIEW = new THREE.Vector3(2.3, 1.9, 3.3);
  const ORBIT_TARGET = new THREE.Vector3(0, 0.55, -0.5);
  const EYE = new THREE.Vector3(0.5, 1.6, 3.2); // standing in the showroom, for the first-person view
  const CRATE_START = new THREE.Vector3(0, 0.5, 0);

  // A small showroom: a crate on a low stand, and two shelves behind it to look around at.
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.1, 40), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  stand.position.y = 0.05;
  const crate = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  crate.position.copy(CRATE_START);
  const crateTag = label('crate', COLORS.orange);
  scene.add(stand, crate, crateTag);
  for (const x of [-1.9, 1.9]) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 0.5), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
    shelf.position.set(x, 0.7, -2.2);
    const shelfTag = label('shelf', COLORS.blue);
    shelfTag.position.set(x, 1.4, -2.2).add(LABEL_LIFT);
    scene.add(shelf, shelfTag);
  }

  const canvas = renderer.domElement;

  // TransformControls: its handles live in a helper, which is what goes in the scene.
  const gizmo = new TransformControls(camera, canvas);
  scene.add(gizmo.getHelper());
  gizmo.addEventListener('dragging-changed', (event) => (controls.enabled = !event.value));

  // PointerLockControls: it turns the camera only while the pointer is locked.
  const look = new PointerLockControls(camera, canvas);
  let lockNote = 'Press "Lock the pointer", then move the mouse.';
  look.addEventListener('lock', () => (lockNote = 'Locked: move the mouse to look. Esc unlocks.'));
  look.addEventListener('unlock', () => (lockNote = 'Unlocked. Press the button to lock again.'));
  const refused = () => (lockNote = 'The browser refused the lock. The rest of the scene still works.');
  document.addEventListener('pointerlockerror', refused);

  const lockButton = document.createElement('button');
  lockButton.textContent = 'Lock the pointer';
  // The same request look.lock() makes, but it also catches a refusal where the browser returns a promise.
  lockButton.addEventListener('click', () => Promise.resolve(canvas.requestPointerLock()).catch(refused));

  let mode: Mode = 'orbit';
  const select = (next: Mode) => {
    if (document.pointerLockElement === canvas) document.exitPointerLock();
    mode = next;
    // Drop any glide left over from the last orbit, then start each member from the same view.
    controls.enableDamping = false;
    controls.update();
    controls.enableDamping = true;
    crate.position.copy(CRATE_START);
    if (next === 'look') {
      camera.position.copy(EYE);
      camera.lookAt(CRATE_START);
    } else {
      camera.position.copy(ORBIT_VIEW);
      controls.target.copy(ORBIT_TARGET);
    }
    controls.enabled = next !== 'look';
    gizmo.enabled = next === 'transform';
    if (next === 'transform') gizmo.attach(crate);
    else gizmo.detach();
    lockButton.hidden = next !== 'look';
    lockNote = 'Press "Lock the pointer", then move the mouse.';
  };

  const readout = overlay(container, 'readout');
  const buttons = overlay(container, 'controls');
  choiceButtons(buttons, [
    { html: '<code>OrbitControls</code>', select: () => select('orbit') },
    { html: '<code>TransformControls</code>', select: () => select('transform') },
    { html: '<code>PointerLockControls</code>', select: () => select('look') },
  ]);
  buttons.append(lockButton);

  const forward = new THREE.Vector3();
  const facing = new THREE.Euler(0, 0, 0, 'YXZ');
  const crateTop = new THREE.Vector3(0, 0.4, 0).add(LABEL_LIFT);
  onFrame(() => {
    crateTag.position.copy(crate.position).add(crateTop);
    if (mode === 'look') {
      // The harness's OrbitControls still runs update() every frame and turns the camera toward its
      // target, so keep the target just ahead of wherever the mouse has turned the camera.
      controls.target.copy(camera.position).add(camera.getWorldDirection(forward));
      facing.setFromQuaternion(camera.quaternion, 'YXZ');
      readout.textContent = [
        'const look = new PointerLockControls(camera, renderer.domElement)',
        'look.lock()   // from a click; Esc unlocks',
        `look.isLocked ${look.isLocked}   turned ${formatNumber(THREE.MathUtils.radToDeg(facing.y), 0)}°, tilted ${formatNumber(THREE.MathUtils.radToDeg(facing.x), 0)}°`,
        lockNote,
      ].join('\n');
    } else if (mode === 'transform') {
      readout.textContent = [
        'const gizmo = new TransformControls(camera, renderer.domElement)',
        'gizmo.attach(crate); scene.add(gizmo.getHelper())',
        `crate.position ${formatVector(crate.position)}   gizmo.dragging ${gizmo.dragging}`,
        'Drag an arrow or a square to move the crate.',
      ].join('\n');
    } else {
      readout.textContent = [
        'const controls = new OrbitControls(camera, renderer.domElement)',
        'controls.enableDamping = true   // so call controls.update() every frame',
        `camera to target ${formatNumber(camera.position.distanceTo(controls.target), 1)} units   target ${formatVector(controls.target)}`,
        'Drag to orbit, right-drag to pan, scroll to dolly.',
      ].join('\n');
    }
  });
};
