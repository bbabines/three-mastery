// Read-the-code questions for the gimbal lock page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `ship.rotation.set(0, Math.PI / 2, 0); // 'XYZ': the middle turn at 90°
// option A:
ship.rotation.x += 0.3;
// option B, instead:
ship.rotation.z += 0.3;`,
    ask: 'How do options A and B compare?',
    choices: [
      'They give exactly the same turn',
      'A tips the nose up, and B rolls it around the nose',
      'Both are ignored while the Y angle sits at 90°',
    ],
    answer: 0,
    why: "At 90°, the X turn and the Z turn go around the same line, so adding to either angle gives the same turn: one of the three ways to turn is gone. That's gimbal lock. `ship.rotateX(0.3)` and `ship.rotateZ(0.3)` would still differ, because they turn the ship's quaternion around its own axes instead of going through the angles.",
  },
  {
    code: `const e = new Euler(0.4, Math.PI / 2, 0.3);
const q = new Quaternion().setFromEuler(e);
const back = new Euler().setFromQuaternion(q);
// back is (0.7, 1.571, 0)`,
    ask: 'Is three.js losing the 0.3?',
    choices: [
      "Yes: it's a known bug in how three.js converts Euler angles",
      'No: back is the same turn, with x and z merged',
      "Yes: a quaternion can't hold a turn that reaches 90°",
    ],
    answer: 1,
    why: "At the lock, only x and z added together matter, so 0.4 and 0.3 can't be told apart from 0.7 and 0. three.js puts the whole spin in x and sets z to 0, and `back` turns an object exactly like `e`. Every three-angle description has a spot like this, in any engine. A quaternion has no such spot.",
  },
  {
    code: `cam.rotation.order = 'YXZ';
cam.rotation.set(-Math.PI / 2, yaw, 0); // looking straight down`,
    ask: 'What does changing `yaw` do now?',
    choices: [
      'Pans the view left and right across the floor',
      'Spins the picture around its middle',
      'Nothing, since the camera is locked at 90°',
    ],
    answer: 1,
    why: "Looking straight down, the upright Y axis runs along the line the camera looks down, so yaw turns the camera around that line: the picture spins, the same as a roll would. To move across the floor, change the camera's `position` instead.",
  },
];
