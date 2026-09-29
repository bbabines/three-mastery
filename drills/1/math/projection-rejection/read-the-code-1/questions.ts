// Read-the-code questions for the projection and rejection page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const v = new Vector3(3, 4, 0);
const along = v.clone().projectOnVector(new Vector3(1, 0, 0));`,
    ask: 'What is `along`?',
    choices: ['(3, 0, 0): only the part along X', '(0, 4, 0): the part not along X', '(1, 0, 0): the X direction itself'],
    answer: 0,
    why: 'Projecting onto the X direction keeps the part of v that runs along X and drops the rest.',
  },
  {
    code: `const v = new Vector3(3, 4, 0);
const flat = v.clone().projectOnPlane(new Vector3(0, 1, 0)); // the floor faces up`,
    ask: 'What is `flat`?',
    choices: [
      '(3, 0, 0): the part flat on the floor',
      '(0, 4, 0): the part going straight up',
      '(3, 4, 0): projecting leaves it unchanged',
    ],
    answer: 0,
    why: "`projectOnPlane` removes the part along the surface's normal, here straight up, and keeps what lies flat.",
  },
  {
    code: `// wallNormal is (0.8, 0, 0.6): a wall at an angle
// velocity is (−2, 0, 0): running along −X, into the wall at an angle
velocity.x = 0;`,
    ask: 'What does the character do?',
    choices: ['It stops dead against the wall', 'It slides along the wall, as intended', 'It bounces back off the wall'],
    answer: 0,
    why: 'Zeroing X leaves (0, 0, 0), because this wall doesn\'t face along X. `velocity.projectOnPlane(wallNormal)` removes only the part going into this wall, so the character slides.',
  },
  {
    code: `if (velocity.dot(wallNormal) < 0) {
  velocity.projectOnPlane(wallNormal);
}`,
    ask: 'Why check the dot product first?',
    choices: [
      'To slide only when moving into the wall',
      'To make sure the velocity has length 1',
      'To check the wall is in front of the camera',
    ],
    answer: 0,
    why: "A negative dot product means the velocity partly points against the wall's normal, into the wall. Moving away, there's nothing to remove.",
  },
];
