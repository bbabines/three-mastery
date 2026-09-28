// Read-the-code questions for the length page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `let nearest = null;
let best = Infinity;
for (const enemy of enemies) {
  const d = player.position.distanceToSquared(enemy.position);
  if (d < best) { best = d; nearest = enemy; }
}`,
    ask: 'Does using the squared distance change which enemy is found?',
    choices: [
      'No: the closest is still the smallest when squared',
      'Yes: squaring reorders enemies more than a unit away',
      'Sometimes: only for enemies within 1 unit',
    ],
    answer: 0,
    why: 'Squaring keeps the order: whichever enemy is closest also has the smallest squared distance. You only need the real distance when you show it or compare it with an actual measurement.',
  },
  {
    code: `const radius = 3;
if (a.distanceToSquared(b) < radius) pickUp();`,
    ask: 'When does `pickUp` run?',
    choices: ['When b is within about 1.7 units', 'When b is within 3 units, the radius', 'When b is within 9 units, radius squared'],
    answer: 0,
    why: 'A squared distance must be compared with a squared radius: `radius * radius`, which is 9. Comparing it with 3 quietly shrinks the circle to about 1.7 units.',
  },
  {
    code: `velocity.clampLength(0, 5);`,
    ask: 'The velocity has length 8. What happens?',
    choices: [
      'It shrinks to length 5, same direction',
      'Each part is capped at 5, like (5, 5, 5)',
      'Nothing, since 8 is already above 0',
    ],
    answer: 0,
    why: '`clampLength` changes only the length, never the direction. It is the usual way to cap a speed.',
  },
];
