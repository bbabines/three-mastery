// Read-the-code questions for the normalize page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const dir = target.position.clone().sub(ship.position).normalize();
ship.position.addScaledVector(dir, 2);`,
    ask: 'How far does the ship move?',
    choices: [
      '2 units toward the target, at any distance',
      'All the way to the target, in a single step',
      'Twice the distance to the target',
    ],
    answer: 0,
    why: "After `normalize()`, `dir` has length 1, so scaling it by 2 moves exactly 2 units in the target's direction, however far away the target is.",
  },
  {
    code: `const velocity = new Vector3(0, 0, -6); // 6 units per second
velocity.normalize();
ship.position.addScaledVector(velocity, delta);`,
    ask: 'What went wrong?',
    choices: [
      'The ship slows to 1 unit per second',
      'The ship now moves backwards, toward you',
      'Nothing: normalizing is always safe to do',
    ],
    answer: 0,
    why: "A velocity's length is its speed. `normalize()` threw the speed away and kept only the direction, so 6 units per second became 1.",
  },
  {
    code: `const dir = target.clone().sub(ship.position).normalize();`,
    ask: 'The ship is exactly at the target. What is `dir`?',
    choices: ['An error is thrown for a zero vector', '(0, 0, 1), a default direction', '(0, 0, 0), with no warning'],
    answer: 2,
    why: 'The move is (0, 0, 0), which has no direction. three.js returns (0, 0, 0) quietly, so check `lengthSq() > 0` first when this can happen.',
  },
];
