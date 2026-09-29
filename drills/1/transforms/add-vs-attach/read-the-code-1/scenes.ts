// Scenes for the add vs attach page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, formatNumber, formatVector, label, line, overlay, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const rack: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.4, 3.9, 6.6);
  controls.target.set(-0.2, 1.2, -0.3);

  const gray = new THREE.MeshStandardMaterial({ color: COLORS.gray });

  // The part's first parent. Its origin is on the floor, under the middle of its top.
  const cart = new THREE.Group();
  cart.position.set(-2.2, 0, 1.2);
  const cartBody = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.3, 0.9), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  cartBody.position.y = 0.275;
  const cartTag = label('cart', COLORS.blue);
  cartTag.position.set(-0.45, 0.65, 0.45);
  cart.add(cartBody, cartTag);

  // The new parent: moved and turned, so the same numbers mean a different spot.
  const shelves = new THREE.Group();
  shelves.rotation.y = THREE.MathUtils.degToRad(35);
  for (const x of [-0.8, 0.8]) {
    for (const z of [-0.3, 0.3]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.9, 0.06), gray);
      post.position.set(x, 0.95, z);
      shelves.add(post);
    }
  }
  for (const y of [0.95, 1.65]) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.06, 0.7), gray);
    plank.position.y = y;
    shelves.add(plank);
  }
  const rackTag = label('rack', COLORS.gray);
  rackTag.position.set(0, 2.15, 0);
  shelves.add(rackTag);

  const part = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  part.add(new THREE.AxesHelper(0.3)); // shows which way the part faces
  const START = new THREE.Vector3(0, 0.6, 0); // on top of the cart, measured from the cart

  // Where the part started, in the world. The cart never moves, so this never changes.
  const ghost = new THREE.Mesh(
    part.geometry,
    new THREE.MeshBasicMaterial({ color: COLORS.orange, transparent: true, opacity: 0.25, depthWrite: false }),
  );
  ghost.position.copy(cart.position).add(START);
  const jump = line(COLORS.orange, 0.7);
  scene.add(cart, shelves, ghost, jump);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const world = new THREE.Vector3();
  let rackX = 1.4;
  let rackXWhenChosen = rackX;
  let mode: 'start' | 'add' | 'attach' = 'start';

  const code = { start: 'cart.add(part)   // the start', add: 'rack.add(part)', attach: 'rack.attach(part)' };
  const describe = () => {
    if (mode === 'start') return 'On the cart. Moving the rack leaves it alone.';
    if (rackX !== rackXWhenChosen) return "Riding along with the rack: it's the rack's child now.";
    return mode === 'add'
      ? 'Jumped: the same numbers, now measured from the rack.'
      : 'Stayed put: new numbers, measured from the rack.';
  };

  const show = () => {
    part.getWorldPosition(world);
    setLine(jump, ghost.position, world);
    jump.visible = world.distanceTo(ghost.position) > 0.01;
    const parentName = part.parent === shelves ? 'rack' : 'cart';
    readout.textContent = [
      `${code[mode]}   → part.parent is the ${parentName}`,
      `part.position             ${formatVector(part.position, 2).padEnd(20)} measured from the ${parentName}`,
      `part.rotation.y           ${formatNumber(THREE.MathUtils.radToDeg(part.rotation.y), 0)}°`,
      `part.getWorldPosition(v)  ${formatVector(world, 2).padEnd(20)} in the world`,
      describe(),
    ].join('\n');
  };

  // Every button starts over from the cart, then reparents the part.
  const choose = (next: typeof mode) => {
    mode = next;
    rackXWhenChosen = rackX;
    shelves.position.set(rackX, 0, -1.3);
    cart.add(part);
    part.position.copy(START);
    part.rotation.set(0, 0, 0);
    part.scale.set(1, 1, 1);
    if (mode === 'add') shelves.add(part);
    if (mode === 'attach') shelves.attach(part);
    show();
  };

  choiceButtons(controlsBar, [
    { html: 'Start', select: () => choose('start') },
    { html: '<code>rack.add(part)</code>', select: () => choose('add') },
    { html: '<code>rack.attach(part)</code>', select: () => choose('attach') },
  ]);
  slider(controlsBar, 'Move rack', { min: 0, max: 2.5, step: 0.25, value: rackX }, (value) => {
    rackX = value;
    shelves.position.x = rackX;
    show();
  });
};
