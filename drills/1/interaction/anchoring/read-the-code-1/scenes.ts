// Scenes for the 3D-to-2D anchoring page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, formatNumber, overlay, screenTag, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { CSS2DObject, CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';

const f = (n: number) => formatNumber(n, 2);

// Is anything in `blockers` between the camera and `spot`? Allows a little room, so the surface an
// anchor sits on doesn't count.
function blockedFrom(camera: THREE.Camera, spot: THREE.Vector3, blockers: THREE.Object3D[], raycaster: THREE.Raycaster) {
  const dir = spot.clone().sub(camera.position);
  const distance = dir.length();
  raycaster.set(camera.position, dir.normalize());
  const first = raycaster.intersectObjects(blockers)[0];
  return { first: first?.distance, distance, blocked: first !== undefined && first.distance < distance - 0.01 };
}

export const pin: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(0.4, 1.9, 3.4);
  controls.target.set(0, 0.7, 0);

  // A machine on a turntable, with a power button on its front and a serial plate on its back.
  const product = new THREE.Group();
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.08, 40), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  stand.position.y = 0.05;
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 0.8), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  body.position.y = 0.54;
  const button = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 24).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: COLORS.yellow }));
  button.position.set(0.35, 0.7, 0.415);
  const plate = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.16, 0.02), new THREE.MeshStandardMaterial({ color: COLORS.green }));
  plate.position.set(-0.25, 0.5, -0.41);
  product.add(stand, body, button, plate);
  // The anchors: just off each surface, so the surface itself never blocks them.
  const powerAnchor = new THREE.Object3D();
  powerAnchor.position.set(0.35, 0.7, 0.45);
  const plateAnchor = new THREE.Object3D();
  plateAnchor.position.set(-0.25, 0.5, -0.44);
  product.add(powerAnchor, plateAnchor);
  scene.add(product);

  const tags = [
    { anchor: powerAnchor, tag: screenTag(container, 'Power', COLORS.yellow), name: 'Power button' },
    { anchor: plateAnchor, tag: screenTag(container, 'Serial plate', COLORS.green), name: 'Serial plate' },
  ];

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const canvas = renderer.domElement;
  const raycaster = new THREE.Raycaster();
  const spot = new THREE.Vector3();
  const ndc = new THREE.Vector3();
  let useRaycast = false;
  let turn = 0;

  // Runs inside every render, after the camera has moved, so the labels never trail behind it.
  scene.onBeforeRender = () => {
    product.rotation.y = THREE.MathUtils.degToRad(turn);
    product.updateMatrixWorld();
    const lines = [useRaycast ? 'hidden = off the view || blocked by a raycast' : 'hidden = |ndc.x| > 1 || |ndc.y| > 1 || |ndc.z| > 1'];
    for (const { anchor, tag, name } of tags) {
      anchor.getWorldPosition(spot);
      ndc.copy(spot).project(camera);
      const offView = Math.abs(ndc.x) > 1 || Math.abs(ndc.y) > 1 || Math.abs(ndc.z) > 1;
      const test = blockedFrom(camera, spot, [body, stand], raycaster);
      tag.hidden = offView || (useRaycast && test.blocked);
      tag.style.left = `${((ndc.x + 1) / 2) * canvas.clientWidth}px`;
      tag.style.top = `${((1 - ndc.y) / 2) * canvas.clientHeight}px`;
      const state = tag.hidden
        ? test.blocked
          ? 'hidden: the product is in front'
          : 'hidden: off the view'
        : test.blocked
          ? 'shown, through the product: wrong'
          : 'shown';
      const hit = test.first === undefined ? 'nothing in front' : `first hit ${f(test.first)} away, anchor ${f(test.distance)}`;
      lines.push(`${name.padEnd(12)} ${hit}   ${state}`);
    }
    readout.textContent = lines.join('\n');
  };

  choiceButtons(bar, [
    { html: 'Check the view only', select: () => (useRaycast = false) },
    { html: 'Also raycast for blockers', select: () => (useRaycast = true) },
  ]);
  slider(bar, 'Turn the product', { min: 0, max: 360, step: 15, value: turn }, (value) => (turn = value));
};

// A label element styled like the harness's screen tags, for CSS2DObject.
function tagElement(text: string, color: string) {
  const element = document.createElement('div');
  element.textContent = text;
  element.style.cssText = `padding: 1px 6px; border-radius: 4px; background: rgba(21, 23, 28, 0.85); color: ${color}; font: 600 12px system-ui, sans-serif; white-space: nowrap;`;
  return element;
}

export const css2d: SceneSetup = ({ scene, camera, controls, container }) => {
  controls.enableDamping = false; // the slider places the camera exactly

  // A wall with a rack behind it, and an exit sign hanging over the walkway.
  const wall = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.2, 0.15), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  wall.position.set(0, 1.1, -2);
  const rack = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.6, 0.5), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  rack.position.set(0.4, 0.8, -3.4);
  const sign = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.22, 0.05), new THREE.MeshStandardMaterial({ color: COLORS.green }));
  sign.position.set(1, 2, 1.2); // on the right, clear of the readout
  scene.add(wall, rack, sign);

  const labelRenderer = new CSS2DRenderer();
  labelRenderer.domElement.style.cssText = 'position: absolute; top: 0; left: 0; pointer-events: none;';
  container.append(labelRenderer.domElement);
  const fit = () => labelRenderer.setSize(container.clientWidth, container.clientHeight);
  new ResizeObserver(fit).observe(container);
  fit();

  const rackTag = new CSS2DObject(tagElement('Rack 12', COLORS.orange));
  rackTag.position.set(0, 1, 0); // just above the rack
  rack.add(rackTag);
  const exitTag = new CSS2DObject(tagElement('Exit', COLORS.green));
  exitTag.position.set(0, 0.25, 0);
  sign.add(exitTag);
  const labels = [
    { object: exitTag, name: 'Exit' },
    { object: rackTag, name: 'Rack 12' },
  ];

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const raycaster = new THREE.Raycaster();
  const spot = new THREE.Vector3();
  let useRaycast = false;
  let walk = 0;

  const place = () => {
    const z = THREE.MathUtils.lerp(5, 0.9, walk);
    camera.position.set(0, 1.6, z);
    controls.target.set(0, 1.5, z - 4);
    controls.update();
  };

  // After each render, with the camera where this frame drew it: test blockers, then place the labels.
  scene.onAfterRender = () => {
    const lines = [useRaycast ? 'label.visible = !blocked; labelRenderer.render(scene, camera)' : 'labelRenderer.render(scene, camera)'];
    for (const { object } of labels) {
      object.getWorldPosition(spot);
      object.visible = !(useRaycast && blockedFrom(camera, spot, [wall, rack, sign], raycaster).blocked);
    }
    labelRenderer.render(scene, camera);
    for (const { object, name } of labels) {
      object.getWorldPosition(spot);
      const z = spot.clone().project(camera).z;
      const blocked = blockedFrom(camera, spot, [wall, rack, sign], raycaster).blocked;
      const shown = object.element.style.display !== 'none';
      const why = !object.visible
        ? 'hidden by the raycast: the wall is in front'
        : z > 1
          ? 'CSS2DRenderer hid it: behind the camera'
          : blocked
            ? 'shown over the wall: wrong'
            : shown
              ? 'shown'
              : 'hidden';
      lines.push(`${name.padEnd(8)} z ${f(z)}   ${why}`);
    }
    readout.textContent = lines.join('\n');
  };

  choiceButtons(bar, [
    { html: '<code>CSS2DRenderer</code> alone', select: () => (useRaycast = false) },
    { html: 'Plus a raycast for blockers', select: () => (useRaycast = true) },
  ]);
  slider(bar, 'Walk forward', { min: 0, max: 1, step: 0.05, value: walk }, (value) => {
    walk = value;
    place();
  });
  place();
};
