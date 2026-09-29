// Read-the-code questions for the point vs direction lesson. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const velocity = new Vector3(0, 0, -2); // per second
ship.position.addScaledVector(velocity, delta); // delta: seconds since the last frame`,
    ask: 'What do the numbers in `velocity` mean?',
    choices: [
      'A move: 2 units into the screen, every second',
      'A place: the fixed spot 2 units into the screen',
      'Both: a place and a move at the same time',
    ],
    answer: 0,
    why: "It's added to a position, so it's a move. The same numbers stored in a `position` would be a fixed spot instead.",
  },
  {
    code: `const a = new Vector3(1, 0, 0);
const b = new Vector3(4, 2, 0);
const move = b.clone().sub(a);`,
    ask: 'What does `move` hold?',
    choices: ['(3, 2, 0)', '(5, 2, 0)', '(−3, −2, 0)'],
    answer: 0,
    why: 'B minus A is the move from A to B: 3 to the right and 2 up. A minus B would point the other way.',
  },
  {
    code: `const move = b.sub(a);
marker.position.copy(b);`,
    ask: 'Where does the marker end up?',
    choices: [
      "At b's original position, unchanged",
      "At the spot matching the move's numbers",
      'At a, because sub moves b onto a',
    ],
    answer: 1,
    why: '`sub` changed `b` itself, so `b` now holds the move instead of its old position. `b.clone().sub(a)` would have kept `b` intact.',
  },
  {
    code: `const dir = target.position.clone().sub(turret.position);
turret.lookAt(dir);`,
    ask: 'Which way does the turret face?',
    choices: ['At the target, as intended', 'At the spot whose numbers match dir', 'Straight up, since dir has no height'],
    answer: 1,
    why: "`lookAt` wants a place. Given a move, it reads the numbers as a spot measured from the origin, which usually isn't the target. Pass `target.position` instead.",
  },
];
