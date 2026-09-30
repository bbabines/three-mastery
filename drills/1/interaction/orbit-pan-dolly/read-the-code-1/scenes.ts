// Scenes for the orbit, pan, dolly page. The README places each one with <div data-scene="name">.
import { buttonGroup, choiceButtons, COLORS, formatNumber, formatVector, label, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

type Move = 'orbit' | 'pan' | 'dolly' | 'zoom';

export const moves: SceneSetup = ({ scene, camera, controls, container }) => {
  const START = new THREE.Vector3(0, 1.4, 6.4);
  const TARGET = new THREE.Vector3(0, 0.7, 0);
  // No glide here, so each move lands at once and the readout shows where it ended up.
  controls.enableDamping = false;

  // A speaker at the target, and a row of posts farther back, to compare dolly with zoom.
  const speaker = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.2, 0.5), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  speaker.position.set(0, 0.61, 0);
  const cone = new THREE.Mesh(new THREE.CircleGeometry(0.2, 32), new THREE.MeshStandardMaterial({ color: '#374151' }));
  cone.position.set(0, 0.2, 0.251);
  speaker.add(cone);
  const speakerTag = label('speaker', COLORS.orange);
  speakerTag.position.set(0.75, 0.9, 0); // beside it, so the readout never covers it
  scene.add(speaker, speakerTag);
  for (const x of [-2.4, -1.2, 1.2, 2.4]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.6), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
    post.position.set(x, 0.8, -4);
    scene.add(post);
  }
  const postsTag = label('posts, 4 behind', COLORS.blue);
  postsTag.position.set(-1.8, 0.35, -4); // between two posts, clear of the speaker
  scene.add(postsTag);

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  let move: Move = 'orbit';
  let amount = 0.5;

  const update = () => {
    camera.position.copy(START);
    controls.target.copy(TARGET);
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    controls.update();
    camera.updateMatrixWorld(); // pan reads the camera's saved matrix for its right and up

    let code = '';
    let note = '';
    if (move === 'orbit') {
      const angle = amount * (Math.PI / 2);
      controls.rotateLeft(angle);
      code = `controls.rotateLeft(${formatNumber(angle)})   // what a left drag does`;
      note = 'Circles the target: the distance to it stays the same.';
    } else if (move === 'pan') {
      const pixels = Math.round(amount * 240);
      controls.pan(pixels, 0);
      code = `controls.pan(${pixels}, 0)   // what a right drag does`;
      note = 'The camera and the target slide together; the angle stays.';
    } else if (move === 'dolly') {
      const scale = 1 / (1 + amount);
      controls.dollyIn(scale);
      code = `controls.dollyIn(${formatNumber(scale)})   // what the wheel does`;
      note = 'The camera moves in: the speaker grows more than the posts.';
    } else {
      camera.zoom = 1 + amount;
      camera.updateProjectionMatrix();
      code = `camera.zoom = ${formatNumber(camera.zoom)}; camera.updateProjectionMatrix()`;
      note = 'The camera stays put: everything grows by the same amount.';
    }
    readout.textContent = [
      code,
      `camera.position ${formatVector(camera.position, 2)}   controls.target ${formatVector(controls.target, 2)}`,
      `camera to target ${formatNumber(camera.position.distanceTo(controls.target))}   camera.zoom ${formatNumber(camera.zoom)}`,
      note,
    ].join('\n');
  };

  choiceButtons(
    buttonGroup(bar),
    (['orbit', 'pan', 'dolly', 'zoom'] as Move[]).map((each) => ({
      html: { orbit: 'Orbit', pan: 'Pan', dolly: 'Dolly', zoom: 'Zoom' }[each],
      select: () => {
        move = each;
        update();
      },
    })),
  );
  slider(bar, 'amount', { min: 0, max: 1, step: 0.05, value: amount }, (value) => {
    amount = value;
    update();
  });
};
