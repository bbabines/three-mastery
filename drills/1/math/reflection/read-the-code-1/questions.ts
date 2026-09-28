// Read-the-code questions for the reflection page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// velocity is (2, −3, 0): falling toward the floor
velocity.reflect(new Vector3(0, 1, 0));`,
    ask: 'What is `velocity` now?',
    choices: [
      '(2, 3, 0): only the downward part flips',
      '(−2, 3, 0): both parts flip direction',
      '(2, −3, 0): the floor normal changes nothing',
    ],
    answer: 0,
    why: 'Reflecting off a floor flips only the part going into the floor, the downward part. The sideways part carries on.',
  },
  {
    code: `const floorNormal = new Vector3(0, 2, 0); // not normalized
velocity.reflect(floorNormal);`,
    ask: 'What goes wrong?',
    choices: [
      'It shoots up much faster than it fell',
      "Nothing, only the normal's direction matters",
      'It passes straight through the floor',
    ],
    answer: 0,
    why: '`reflect` assumes the normal has length 1. At length 2, it removes the downward part several times over, flinging the ball upward.',
  },
  {
    code: `vec3 mirrored = reflect(-toCamera, normal);
vec3 shine = texture(envMap, mirrored).rgb;`,
    ask: 'What does `mirrored` point at?',
    choices: [
      'What the surface shows, like a mirror',
      'The nearest light shining on the surface',
      'Back toward the camera that sees it',
    ],
    answer: 0,
    why: "Bouncing the camera's view off the surface gives the direction a mirror would show. Looking that direction up in the environment map gives the reflection.",
  },
];
