// Scenes for the pivots and offset groups page. The README places each one with <div data-scene="name">.
import { ball, choiceButtons, COLORS, formatNumber, formatVector, label, LABEL_LIFT, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const hinge: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2.5, 3.1, 4.6);
  controls.target.set(0, 1.3, -0.3);

  const WIDTH = 1.2;
  const frameMaterial = new THREE.MeshStandardMaterial({ color: COLORS.gray });
  const leftPost = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.1, 0.12), frameMaterial);
  leftPost.position.set(-0.68, 1.1, 0);
  const rightPost = leftPost.clone();
  rightPost.position.x = 0.68;
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.44, 0.08, 0.12), frameMaterial);
  top.position.set(0, 2.19, 0);

  // The pivot group sits on the door's left edge; the door hangs from it, offset by half its width.
  const hingeGroup = new THREE.Group();
  hingeGroup.position.set(-WIDTH / 2, 1.1, 0);
  const door = new THREE.Mesh(new THREE.BoxGeometry(WIDTH, 2, 0.08), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  door.position.x = WIDTH / 2;
  const handle = ball(COLORS.white, 1, 0.05);
  handle.position.set(WIDTH / 2 - 0.12, 0, 0.07);
  door.add(handle);
  hingeGroup.add(door);

  // Markers for the two origins, drawn on top so the door never hides them.
  const hingeMark = ball(COLORS.yellow, 1, 0.07);
  const doorMark = ball(COLORS.blue, 1, 0.07);
  for (const mark of [hingeMark, doorMark]) {
    mark.material.depthTest = false;
    mark.renderOrder = 1;
  }
  hingeGroup.add(hingeMark);
  door.add(doorMark);
  const hingeTag = label('hinge', COLORS.yellow);
  hingeTag.position.set(-1.1, 1.1, 0.1); // the hinge group never moves, so neither does its label
  const doorTag = label("door's origin", COLORS.blue);
  scene.add(leftPost, rightPost, top, hingeGroup, hingeTag, doorTag);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let degrees = 60;
  let mode: 'door' | 'hinge' | 'pivot' = 'door';
  const hingeEdge = new THREE.Vector3(-WIDTH / 2, 0, 0); // measured from the door itself
  const edge = new THREE.Vector3();
  const middle = new THREE.Vector3();

  const update = () => {
    const radians = THREE.MathUtils.degToRad(degrees);
    hingeGroup.rotation.y = mode === 'hinge' ? radians : 0;
    door.rotation.y = mode === 'hinge' ? 0 : radians;
    door.pivot = mode === 'pivot' ? hingeEdge : null;
    hingeGroup.updateWorldMatrix(true, true);

    door.localToWorld(edge.copy(hingeEdge));
    door.getWorldPosition(middle);
    doorTag.position.copy(middle).add(LABEL_LIFT);

    const code = {
      door: `door.rotation.y = ${formatNumber(radians)}`,
      hinge: `hinge.rotation.y = ${formatNumber(radians)}`,
      pivot: `door.pivot = ${formatVector(hingeEdge)}; door.rotation.y = ${formatNumber(radians)}`,
    }[mode];
    const swings = { door: 'stays put', hinge: 'swings around the hinge', pivot: 'swings around the pivot' }[mode];
    const summary = {
      door: 'The door spins around its own middle.',
      hinge: 'The door swings on its hinge.',
      pivot: "The door swings on its hinge, but its position doesn't say so.",
    }[mode];
    readout.innerHTML = [
      `${code}   // ${degrees}°`,
      `<span style="color:${COLORS.yellow}">hinge edge, in the world</span>  ${formatVector(edge, 2).padEnd(19)} ${mode === 'door' ? 'moves' : 'stays put'}`,
      `<span style="color:${COLORS.blue}">door.getWorldPosition(v)</span>  ${formatVector(middle, 2).padEnd(19)} ${swings}`,
      `door.position             ${formatVector(door.position, 2).padEnd(19)} never changes`,
      summary,
    ].join('\n');
  };
  choiceButtons(controlsBar, [
    {
      html: '<code>door.rotation.y = a</code>',
      select: () => {
        mode = 'door';
        update();
      },
    },
    {
      html: '<code>hinge.rotation.y = a</code>',
      select: () => {
        mode = 'hinge';
        update();
      },
    },
    {
      html: '<code>door.pivot</code>, then <code>door.rotation.y = a</code>',
      select: () => {
        mode = 'pivot';
        update();
      },
    },
  ]);
  slider(controlsBar, 'Open a', { min: 0, max: 90, step: 15, value: degrees }, (value) => {
    degrees = value;
    update();
  });
};
