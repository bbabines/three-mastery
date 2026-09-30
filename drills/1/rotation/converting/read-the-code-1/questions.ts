// Read-the-code questions for the converting representations page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `ship.rotation.set(0, MathUtils.degToRad(120), 0);
const back = new Euler().setFromQuaternion(ship.quaternion);`,
    ask: "What are `back`'s angles, in degrees?",
    choices: ['(0, 120, 0)', '(−180, 60, −180)', '(0, 60, 0)'],
    answer: 1,
    why: 'The middle angle read back always lies between −90° and 90°, so 120° is written another way: the same turn, different numbers. Compare turns with `angleTo`, not angles.',
  },
  {
    code: `// a and b face the same way, but were turned by different code
a.quaternion.equals(b.quaternion);`,
    ask: 'Can this return `false`?',
    choices: ['No: a turn has only one quaternion', 'Yes: q and −q are the same turn', 'No: equals compares the turns'],
    answer: 1,
    why: '`equals` compares the four numbers exactly, and every turn has two quaternions, q and −q. Compare the turns with `a.quaternion.angleTo(b.quaternion) < 1e-4`.',
  },
  {
    code: `const saved = cam.rotation.toArray(); // [-0.5, 0.8, 0, 'YXZ']
// later, on another camera:
cam2.rotation.set(saved[0], saved[1], saved[2]);`,
    ask: 'Does `cam2` face the same way as `cam`?',
    choices: ["No: set dropped the 'YXZ' order", 'Yes: three angles are all it needs', 'Yes: the order comes on the next render'],
    answer: 0,
    why: "Without an order, `set` keeps `cam2`'s own order, `'XYZ'`, so the same numbers make a turn about 22° off. Use `cam2.rotation.fromArray(saved)`.",
  },
];
