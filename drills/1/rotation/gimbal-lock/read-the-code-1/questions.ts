// Read-the-code questions for the gimbal lock page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `ship.rotation.set(0, Math.PI / 2, 0); // 'XYZ', the middle turn at 90°
ship.rotation.x += 0.3; // option A
// or, instead:
ship.rotation.z += 0.3; // option B`,
    ask: 'How do options A and B compare?',
    choices: ['They give exactly the same turn', 'A tips the nose, and B rolls it', 'Both are ignored while y is 90°'],
    answer: 0,
    why: 'At 90°, the X and Z turns go around the same line, so either change gives the same turn. `ship.rotateX(0.3)` and `ship.rotateZ(0.3)` would still differ.',
  },
  {
    code: `const e = new Euler(0.4, Math.PI / 2, 0.3);
const back = new Euler().setFromQuaternion(new Quaternion().setFromEuler(e));
// back is (0.7, 1.571, 0)`,
    ask: 'Is three.js losing the 0.3?',
    choices: [
      'Yes: a known bug in Euler conversion',
      'No: x and z merged, and the turn is the same',
      "Yes: a quaternion can't hold a 90° turn",
    ],
    answer: 1,
    why: 'At the lock only x plus z matters, so three.js puts it all in x, and `back` is the same turn. Any three-angle description has this spot; compare turns, not angles.',
  },
  {
    code: `cam.rotation.order = 'YXZ';
cam.rotation.set(-Math.PI / 2, yaw, 0); // looking straight down`,
    ask: 'What does changing `yaw` do now?',
    choices: ['Pans the view across the floor', 'Spins the picture around its middle', 'Nothing, since the camera is locked'],
    answer: 1,
    why: "Looking straight down, the upright Y runs along the view, so yaw spins the picture the way a roll would. Change the camera's `position` to move across the floor.",
  },
];
