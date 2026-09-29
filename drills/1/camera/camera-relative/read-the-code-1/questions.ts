// Read-the-code questions for the camera-relative directions page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const forward = new Vector3(0, 0, 1).applyQuaternion(camera.quaternion);
camera.position.addScaledVector(forward, speed * delta); // the W key`,
    ask: 'Which way does W move the camera?',
    choices: ['Forward, the way it looks', 'Backward, away from what it sees', "Along the world's +Z, whatever it faces"],
    answer: 1,
    why: "A camera looks down its own −Z, so its own +Z, turned by its quaternion, points backward. Use `camera.getWorldDirection(forward)`, which gives a camera's −Z direction in the world. For other objects, `getWorldDirection` gives their +Z.",
  },
  {
    code: `camera.position.set(0, 10, 0);
camera.lookAt(0, 0, 0); // straight down
const forward = camera.getWorldDirection(new Vector3());
const right = forward.clone().cross(camera.up);`,
    ask: 'How long is `right`?',
    choices: ['Exactly 1', 'Exactly 0', 'About 0.0001'],
    answer: 2,
    why: "Forward and up are almost parallel, and the cross product of parallel directions is (0, 0, 0), as on the cross product page. `lookAt` nudges the view by 0.0001 so its own math doesn't fail, so `right` comes out 0.0001 long: anything moved along it barely moves. A camera turned straight down some other way can leave only rounding noise, pointing anywhere. Take right from the matrix: `setFromMatrixColumn(camera.matrixWorld, 0)`.",
  },
  {
    code: `camera.rotation.y += Math.PI / 2; // turn a quarter to the left
const right = new Vector3().setFromMatrixColumn(camera.matrixWorld, 0);`,
    ask: 'Which direction does `right` hold?',
    choices: ['The new right, after the turn', 'The right from before the turn', "The world's +X, whatever the camera does"],
    answer: 1,
    why: '`setFromMatrixColumn` reads `matrixWorld` as it was last saved, and changing `rotation` doesn\'t refresh it. Call `camera.updateMatrixWorld()` after the turn. `getWorldDirection` doesn\'t have this problem: it refreshes first.',
  },
];
