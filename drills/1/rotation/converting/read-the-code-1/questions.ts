// Read-the-code questions for the converting representations page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `ship.rotation.set(0, MathUtils.degToRad(120), 0);
const back = new Euler().setFromQuaternion(ship.quaternion);`,
    ask: "What are `back`'s angles, in degrees?",
    choices: ['(0, 120, 0)', '(−180, 60, −180)', '(0, 60, 0)'],
    answer: 1,
    why: "When three.js works out angles from a quaternion, the middle angle always comes out between −90° and 90°. A 120° turn around Y doesn't fit that, so it comes back written another way: flip 180° around X, turn 60° around Y, flip 180° around Z. It's the same turn with different numbers. (0, 60, 0) would be a different turn.",
  },
  {
    code: `// a and b face exactly the same way, but were turned by different code
const same = a.quaternion.equals(b.quaternion);`,
    ask: 'Can `same` be `false`?',
    choices: [
      'No: any one turn only ever has one quaternion',
      'Yes: one turn has two quaternions, q and −q',
      'No: equals compares the turns, not the numbers',
    ],
    answer: 1,
    why: 'Every turn has two quaternions, q and −q, and `equals` compares the four numbers exactly, so even a rounding difference in the last digit makes it `false`. Compare the turns instead: `a.quaternion.angleTo(b.quaternion) < 1e-4`.',
  },
  {
    code: `const saved = cam.rotation.toArray(); // [-0.5, 0.8, 0, 'YXZ']
// later, on another camera:
cam2.rotation.set(saved[0], saved[1], saved[2]);`,
    ask: 'Does `cam2` face the same way as `cam`?',
    choices: [
      "No: set dropped the 'YXZ' order",
      'Yes: the three angles are all a turn needs',
      'Yes: the order is picked up on the next render',
    ],
    answer: 0,
    why: "`rotation.set(x, y, z)` without an order keeps `cam2`'s own order, `'XYZ'` by default, so the same three numbers make a different turn, about 22° off here. Load with `cam2.rotation.fromArray(saved)`, which sets the order too, or save the quaternion instead.",
  },
];
