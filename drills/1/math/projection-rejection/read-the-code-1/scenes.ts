// Scenes for the projection and rejection page. The README places each one with <div data-scene="name">.
import { arrow, ball, choiceButtons, COLORS, formatVector, label, line, overlay, setArrow, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const split: SceneSetup = ({ scene, camera, container }) => {
  camera.position.set(0.5, 6, 4.5);

  const origin = new THREE.Vector3(0, 0.05, 0); // just above the floor, so nothing hides in the grid
  const direction = new THREE.Vector3(2, 0, -1).normalize();
  const v = new THREE.Vector3(0.5, 0, -2.5);

  const guide = line(COLORS.blue);
  setLine(guide, origin.clone().addScaledVector(direction, -3.5), origin.clone().addScaledVector(direction, 3.5));
  const guideTag = label('direction', COLORS.blue);
  guideTag.position.copy(direction).multiplyScalar(3.2).add(new THREE.Vector3(0, 0.2, 0.4));
  const vArrow = arrow(COLORS.yellow);
  const vTag = label('v', COLORS.yellow);
  const alongArrow = arrow(COLORS.green);
  const leftoverArrow = arrow(COLORS.orange);
  scene.add(guide, guideTag, vArrow, vTag, alongArrow, leftoverArrow);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');

  const update = () => {
    const along = v.clone().projectOnVector(direction);
    const leftover = v.clone().projectOnPlane(direction);
    setArrow(vArrow, origin, v);
    vTag.position.copy(v).multiplyScalar(1.12).setY(0.2);
    setArrow(alongArrow, origin, along);
    setArrow(leftoverArrow, origin.clone().add(along), leftover);

    readout.innerHTML = [
      `<span style="color:${COLORS.yellow}">v                                   ${formatVector(v)}</span>`,
      `<span style="color:${COLORS.green}">v.clone().projectOnVector(direction) ${formatVector(along)}  along</span>`,
      `<span style="color:${COLORS.orange}">v.clone().projectOnPlane(direction)  ${formatVector(leftover)}  leftover</span>`,
    ].join('\n');
  };
  slider(sliders, 'v x', { min: -3, max: 3, step: 0.5, value: v.x }, (value) => {
    v.x = value;
    update();
  });
  slider(sliders, 'v z', { min: -3, max: 3, step: 0.5, value: v.z }, (value) => {
    v.z = value;
    update();
  });
  update();
};

const RUN_SECONDS = 2;
const SLIDE_SECONDS = 3;
const LOOP_SECONDS = 5.5;

export const wallSlide: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(3, 4, 5);
  controls.target.set(0.5, 0.3, 0);

  const wallNormal = new THREE.Vector3(0.8, 0, 0.6);
  const velocity = new THREE.Vector3(-1.5, 0, 0);
  const contact = wallNormal.clone().multiplyScalar(0.16).setY(0.3); // ball center when it touches the wall
  const start = contact.clone().addScaledVector(velocity, -RUN_SECONDS);

  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 1.5),
    new THREE.MeshStandardMaterial({ color: '#6b7280', transparent: true, opacity: 0.5, side: THREE.DoubleSide }),
  );
  wall.lookAt(wallNormal);
  wall.position.y = 0.75;
  const normalArrow = arrow(COLORS.blue);
  setArrow(normalArrow, new THREE.Vector3(-1.2, 1.2, 1.6), wallNormal);
  const normalTag = label('wallNormal', COLORS.blue);
  normalTag.position.set(-0.3, 1.6, 2.2);

  const runner = ball(COLORS.yellow);
  const motion = arrow(COLORS.green);
  scene.add(wall, normalArrow, normalTag, runner, motion);

  const status = overlay(container, 'readout');
  let slide = new THREE.Vector3();
  let now = 0;
  let restartedAt = 0;

  onFrame((_, elapsed) => {
    now = elapsed;
    const t = (elapsed - restartedAt) % LOOP_SECONDS;
    if (t < RUN_SECONDS) {
      runner.position.copy(start).addScaledVector(velocity, t);
      setArrow(motion, runner.position, velocity.clone().multiplyScalar(0.6));
    } else {
      runner.position.copy(contact).addScaledVector(slide, Math.min(t - RUN_SECONDS, SLIDE_SECONDS));
      setArrow(motion, runner.position, slide.clone().multiplyScalar(0.6));
    }
  });

  const choose = (newSlide: THREE.Vector3, text: string) => {
    slide = newSlide;
    restartedAt = now;
    status.textContent = text;
  };
  choiceButtons(overlay(container, 'controls'), [
    {
      html: '<code>velocity.projectOnPlane(wallNormal)</code>',
      select: () => choose(velocity.clone().projectOnPlane(wallNormal), 'Slides along the wall.'),
    },
    {
      html: '<code>velocity.x = 0</code>',
      select: () => choose(velocity.clone().setX(0), `Stops dead: this wall doesn't face along X,\nso zeroing X removes the wrong part.`),
    },
  ]);
};
