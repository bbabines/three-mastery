// Read-the-code questions for the NaN and degenerate cases page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const toTarget = target.position.clone().sub(ship.position); // (0, 0, 0): it has arrived
toTarget.divideScalar(toTarget.length());
ship.position.addScaledVector(toTarget, speed * delta);`,
    ask: 'What happens to the ship?',
    choices: [
      'divideScalar throws a divide-by-zero error',
      'It stays put, the same as with normalize()',
      'Its position becomes NaN, and it vanishes for good',
    ],
    answer: 2,
    why: "0 / 0 is NaN, and JavaScript doesn't throw, so the position becomes NaN and stays NaN every frame after. `toTarget.normalize()` returns (0, 0, 0) instead.",
  },
  {
    code: `part.position.y = Math.acos(dot) * radius; // dot came out 1.0000000000000002
const hits = raycaster.intersectObject(part);`,
    ask: 'What does `hits` hold?',
    choices: [
      'An empty array, since a NaN part is never hit',
      'An error message about the NaN position',
      'A hit for every triangle, each at distance NaN',
    ],
    answer: 2,
    why: "`Math.acos` of anything over 1 is NaN, so the part's `matrixWorld` is NaN. Every comparison with NaN is false, so no test rules a triangle out. `a.angleTo(b)` clamps.",
  },
  {
    code: `// ship.position.x really is NaN here
console.log(ship.position.x === NaN);`,
    ask: 'What does it log?',
    choices: ['true', 'false', 'An error'],
    answer: 1,
    why: 'NaN is not equal to anything, itself included, so `=== NaN` is always `false`. Test with `Number.isNaN(ship.position.x)`.',
  },
];
