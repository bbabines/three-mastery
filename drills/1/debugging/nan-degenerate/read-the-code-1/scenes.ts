// Scenes for the NaN and degenerate cases page. The README places each one with <div data-scene="name">.
import { ball, choiceButtons, COLORS, formatVector, label, LABEL_LIFT, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const STOPS = [
  new THREE.Vector3(-1.8, 0.3, -0.8),
  new THREE.Vector3(1.6, 0.3, -1),
  new THREE.Vector3(1.3, 0.3, 1.2),
  new THREE.Vector3(-1.4, 0.3, 1),
];
const SPEED = 1.6; // units per second
const SECONDS_PER_STOP = 3;

export const follower: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(0, 3.1, 3.5);
  controls.target.set(0, 0.1, 0.1);

  const target = ball(COLORS.red);
  const chaser = ball(COLORS.yellow);
  const tag = label('follower', COLORS.yellow);
  tag.position.copy(LABEL_LIFT);
  chaser.add(tag); // a child, to show NaN reaching it too
  scene.add(target, chaser);

  const toTarget = new THREE.Vector3();
  const velocity = new THREE.Vector3();
  const tagWorld = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();
  raycaster.ray.direction.set(0, -1, 0);
  let divide = true;

  const start = () => chaser.position.set(0, 0.3, 0);
  start();

  const bar = overlay(container, 'controls');
  choiceButtons(bar, [
    { html: '<code>toTarget.divideScalar(toTarget.length())</code>', select: () => ((divide = true), start()) },
    { html: '<code>toTarget.normalize()</code>', select: () => ((divide = false), start()) },
  ]);
  const again = document.createElement('button');
  again.textContent = 'Start over';
  again.addEventListener('click', start);
  bar.append(again);

  const readout = overlay(container, 'readout');
  let clock = 0;
  onFrame((frameDelta) => {
    const delta = Number.isFinite(frameDelta) ? Math.max(0, frameDelta) : 0; // the timer can step back after a hidden tab
    clock += delta;
    target.position.copy(STOPS[Math.floor(clock / SECONDS_PER_STOP) % STOPS.length]);

    // A common way to follow: head for the target, slowing on the last step so it lands right on it.
    // Once it has landed, the distance is 0: divideScalar makes 0 / 0, NaN, and NaN times the zero
    // speed is still NaN. normalize() returns (0, 0, 0) instead.
    toTarget.copy(target.position).sub(chaser.position);
    const distance = toTarget.length();
    if (divide) toTarget.divideScalar(distance);
    else toTarget.normalize();
    velocity.copy(toTarget).multiplyScalar(delta > 0 ? Math.min(SPEED, distance / delta) : 0);
    chaser.position.addScaledVector(velocity, delta);

    chaser.updateMatrixWorld();
    tag.getWorldPosition(tagWorld);
    raycaster.ray.origin.set(target.position.x + 0.05, 3, target.position.z); // just off the ball's pole, where 32 triangles meet
    const hits = raycaster.intersectObject(chaser, false);
    const hitText =
      hits.length === 0
        ? 'no hits'
        : Number.isNaN(hits[0].distance)
          ? `${hits.length} hits, every distance NaN`
          : `${hits.length} hit${hits.length === 1 ? '' : 's'}, the first at distance ${hits[0].distance.toFixed(2)}`;

    readout.textContent = [
      divide ? 'toTarget.divideScalar(toTarget.length())' : 'toTarget.normalize()',
      `follower.position         ${formatVector(chaser.position, 2)}`,
      `tag.getWorldPosition(v)   ${formatVector(tagWorld, 2)}   the child`,
      `ray straight down at red  ${hitText}`,
    ].join('\n');
  });
};
