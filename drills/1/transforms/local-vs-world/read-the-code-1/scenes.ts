// Scenes for the local vs world space page. The README places each one with <div data-scene="name">.
import { arrow, ball, choiceButtons, COLORS, formatVector, label, LABEL_LIFT, line, overlay, pointer, setArrow, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const carry: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.3, 3.6, 5.4);
  controls.target.set(-0.2, 0.6, -1.3);

  // The cart's origin sits on its top surface, so its axes show above the body.
  const cart = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.2, 1.4), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  body.position.y = -0.1;
  const cartTag = label('cart', COLORS.blue);
  cartTag.position.set(-1, 0.35, 0);

  // A ball on a pole, raised so both arrows to it stay clear of the cart and its axes.
  const rider = ball(COLORS.yellow);
  rider.position.set(1, 0.8, 0);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  pole.position.set(1, 0.4, 0);
  // Drawn inside the cart, so it moves, turns, and grows with it: the ball's position as the cart measures it.
  const fromCart = arrow(COLORS.orange);
  setArrow(fromCart, new THREE.Vector3(), rider.position);
  cart.add(body, new THREE.AxesHelper(0.6), cartTag, pole, rider, fromCart);

  const fromWorld = arrow(COLORS.white);
  const originTag = label('world origin', COLORS.gray);
  originTag.position.set(-0.4, -0.35, 0.4);
  scene.add(cart, fromWorld, originTag);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  const values = { x: -1.5, turn: 0, size: 1 };
  const world = new THREE.Vector3();

  const update = () => {
    cart.position.set(values.x, 0.3, -1.5);
    cart.rotation.y = THREE.MathUtils.degToRad(values.turn);
    cart.scale.setScalar(values.size);

    rider.getWorldPosition(world);
    setArrow(fromWorld, new THREE.Vector3(), world);
    readout.innerHTML = [
      `<span style="color:${COLORS.orange}">→</span> ball.position             ${formatVector(rider.position).padEnd(18)} measured from the cart`,
      `<span style="color:${COLORS.white}">→</span> ball.getWorldPosition(v)  ${formatVector(world).padEnd(18)} in the world`,
    ].join('\n');
  };
  slider(sliders, 'Move cart', { min: -2, max: 2, step: 0.5, value: values.x }, (value) => {
    values.x = value;
    update();
  });
  slider(sliders, 'Turn cart', { min: -180, max: 180, step: 15, value: values.turn }, (value) => {
    values.turn = value;
    update();
  });
  slider(sliders, 'Cart size', { min: 0.5, max: 1.5, step: 0.25, value: values.size }, (value) => {
    values.size = value;
    update();
  });
  update();
};

export const aim: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(1, 3.3, 5.3);
  controls.target.set(-0.5, 0.6, -0.9);

  const shelfMaterial = new THREE.MeshStandardMaterial({ color: COLORS.gray });
  const shelf = new THREE.Group();
  const plank = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 0.8), shelfMaterial);
  plank.position.y = 1;
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1), shelfMaterial);
  post.position.y = 0.5;
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshStandardMaterial({ color: COLORS.red }));
  box.position.set(0, 1.2, 0);
  const boxTag = label('box, on the shelf', COLORS.red);
  boxTag.position.copy(box.position).add(LABEL_LIFT);
  shelf.add(plank, post, box, boxTag);

  const turret = pointer(COLORS.yellow);
  turret.position.set(-3, 0.6, 1);
  const turretTag = label('turret', COLORS.yellow);
  turretTag.position.copy(turret.position).add(LABEL_LIFT);

  // Where lookAt goes when it's handed box.position: those numbers read as a spot in the world.
  const wrongSpot = ball(COLORS.gray, 0.6);
  wrongSpot.position.copy(box.position);
  const wrongTag = label(`spot ${formatVector(box.position)}`, COLORS.gray);
  wrongTag.position.copy(box.position).add(LABEL_LIFT);

  const aimLine = line(COLORS.yellow);
  scene.add(shelf, turret, turretTag, wrongSpot, wrongTag, aimLine);

  const status = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const spot = new THREE.Vector3();
  let useWorld = false;
  let shelfX = 1.5;

  const update = () => {
    shelf.position.set(shelfX, 0, -2.5);
    const aimAt = useWorld ? box.getWorldPosition(spot) : box.position;
    turret.lookAt(aimAt);
    setLine(aimLine, turret.position, aimAt);
    wrongSpot.visible = wrongTag.visible = !useWorld;
    status.textContent = useWorld
      ? `Facing the box, at ${formatVector(spot)} in the world.`
      : `Misses: facing the spot ${formatVector(box.position)} in the world,\nthe numbers in box.position.`;
  };
  choiceButtons(controlsBar, [
    {
      html: '<code>turret.lookAt(box.position)</code>',
      select: () => {
        useWorld = false;
        update();
      },
    },
    {
      html: '<code>turret.lookAt(box.getWorldPosition(spot))</code>',
      select: () => {
        useWorld = true;
        update();
      },
    },
  ]);
  slider(controlsBar, 'Move shelf', { min: -1, max: 3, step: 0.5, value: shelfX }, (value) => {
    shelfX = value;
    update();
  });
};
