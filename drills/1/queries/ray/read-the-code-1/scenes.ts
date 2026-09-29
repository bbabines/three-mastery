// Scenes for the ray page. The README places each one with <div data-scene="name">.
import { ball, choiceButtons, COLORS, formatNumber, formatVector, label, LABEL_LIFT, line, overlay, pointer, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const START = new THREE.Vector3(-0.5, 1, 0);
const REACH = 4; // how far the drawn lines run each way from the start

export const beam: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 2.1, 4.6);
  controls.target.set(-0.2, 0.75, 0);

  const laser = pointer(COLORS.red, 0.7);
  laser.position.copy(START);
  const startTag = label('start', COLORS.red);
  startTag.position.copy(START).add(LABEL_LIFT);

  const crate = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8),new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  const crateTag = label('crate', COLORS.orange);
  const hitMark = ball(COLORS.white, 1, 0.07);

  const ray = line(COLORS.red); // the ray: from the start to the hit, or on and on
  const behind = line(COLORS.gray, 0.7); // the same line behind the start, which isn't part of the ray
  const behindTag = label('not part of the ray', COLORS.gray);
  scene.add(laser, startTag, crate, crateTag, hitMark, ray, behind, behindTag);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const raycaster = new THREE.Raycaster();
  const direction = new THREE.Vector3(1, 0, 0);
  let crateX = 2; // whole steps, so the crate never swallows the start

  const update = () => {
    crate.position.set(crateX, START.y, 0);
    crate.updateMatrixWorld(); // it just moved, and the raycast reads matrixWorld
    crateTag.position.copy(crate.position).add(new THREE.Vector3(0, 0.6, 0));
    laser.lookAt(START.clone().add(direction));

    raycaster.set(START, direction);
    const hit = raycaster.intersectObject(crate)[0];
    const end = hit ? hit.point : START.clone().addScaledVector(direction, REACH);
    setLine(ray, START, end);
    setLine(behind, START, START.clone().addScaledVector(direction, -REACH));
    behindTag.position.copy(START).addScaledVector(direction, -2.2).add(new THREE.Vector3(0, -0.7, 0)); // under the crate's path
    hitMark.visible = !!hit;
    if (hit) hitMark.position.copy(hit.point);

    readout.textContent = [
      `raycaster.set(start ${formatVector(START)}, direction ${formatVector(direction)})`,
      `crate at x = ${formatNumber(crateX)}`,
      'raycaster.intersectObject(crate)',
      hit
        ? `→ a hit at ${formatVector(hit.point, 2)}, ${formatNumber(hit.distance)} along the ray`
        : '→ [] no hits: the crate is behind the start',
    ].join('\n');
  };

  choiceButtons(controlsBar, [
    {
      html: 'direction <code>(1, 0, 0)</code>',
      select: () => {
        direction.set(1, 0, 0);
        update();
      },
    },
    {
      html: 'direction <code>(−1, 0, 0)</code>',
      select: () => {
        direction.set(-1, 0, 0);
        update();
      },
    },
  ]);
  slider(controlsBar, 'Slide the crate', { min: -3, max: 3, step: 1, value: crateX }, (value) => {
    crateX = value;
    update();
  });
};
