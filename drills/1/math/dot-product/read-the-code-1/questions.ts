// Read-the-code questions for the dot product page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const a = new Vector3(1, 0, 0);
const b = new Vector3(1, 0, -1).normalize(); // 45° away from a
a.dot(b);`,
    ask: 'What does this return?',
    choices: ['About 0.71, partway between', "0, since they aren't lined up", '1, since they point roughly the same way'],
    answer: 0,
    why: 'The dot product is a smooth scale, not just −1, 0, or 1. Two length-1 directions 45° apart agree a good deal, but not fully.',
  },
  {
    code: `const forward = new Vector3(0, 0, -2);
const toTarget = new Vector3(0, 0, -5);
forward.dot(toTarget);`,
    ask: 'What comes back?',
    choices: ['10, because neither has length 1', '1, because they point the same way', '−1, because both point away from you'],
    answer: 0,
    why: 'The 1 to −1 scale only holds for length-1 directions. Here the result is multiplied by both lengths, 2 and 5. Normalize first to get an agreement score.',
  },
  {
    code: `const toTarget = target.position.clone().sub(guard.position).normalize();
const seen = guardForward.dot(toTarget) > 0.5; // guardForward has length 1`,
    ask: 'When is `seen` true?',
    choices: [
      'When the target is within 60° of forward',
      'When the target is closer than 0.5 units',
      'When the target is in front, at any angle',
    ],
    answer: 0,
    why: 'Both directions have length 1, so the dot product is an agreement score. 0.5 is what `Math.cos` gives for 60°, so anything above it is inside a 60° cone.',
  },
  {
    code: `float light = max(dot(normal, toLight), 0.0);`,
    ask: 'A surface faces directly away from the light. What is `light`?',
    choices: ['0, because max clamps the −1 up to 0', '−1, so it turns darker than black', '1, as the light shines through'],
    answer: 0,
    why: 'Facing away gives −1. `max(…, 0.0)` stops the value going below 0, so the back of the object is simply unlit.',
  },
  {
    code: `const angle = Math.acos(a.dot(b)); // a and b are the same unit direction`,
    ask: 'What can `angle` be?',
    choices: ['Sometimes NaN, from rounding above 1', 'Always exactly 0, since they match', 'Always exactly 1, like the dot product'],
    answer: 0,
    why: 'Rounding can produce 1.0000000000000002, and `Math.acos` of anything over 1 is NaN. `a.angleTo(b)` clamps the value first.',
  },
];
