// Read-the-code questions for the lerp page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const spot = a.clone().lerp(b, 0.25);`,
    ask: 'Where is `spot`?',
    choices: ['A quarter of the way from a to b', 'A quarter of the way from b to a', 'At a, with its numbers cut to a quarter'],
    answer: 0,
    why: '`t` is how far from the start (a) toward the end (b). 0.25 is a quarter of the way along.',
  },
  {
    code: `marker.position.lerpVectors(a, b, 1.5);`,
    ask: 'Where does the marker end up?',
    choices: ['Past b, by half the gap again', 'At b, because t stops at 1', 'At a, since t over 1 wraps around'],
    answer: 0,
    why: "Lerp doesn't clamp. Above 1 it keeps going past the end, here by half the distance from a to b. Clamp `t` when that's not what you want.",
  },
  {
    code: `const left = new Vector3(-1, 0, 0);
const right = new Vector3(1, 0, 0);
const dir = left.clone().lerp(right, 0.5);`,
    ask: 'What is `dir`?',
    choices: ['(0, 0, 0), which has no direction', '(0, 0, 1), the direction between them', '(0, 1, 0), pointing straight up between them'],
    answer: 0,
    why: 'Halfway between opposite directions is no direction at all. Blending directions shortens them, all the way to zero for opposites. Normalize after blending, or use slerp for rotations.',
  },
];
