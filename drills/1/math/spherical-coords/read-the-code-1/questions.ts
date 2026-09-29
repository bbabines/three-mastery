// Read-the-code questions for the spherical coordinates page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const s = new Spherical(5, 0, 0);
camera.position.setFromSpherical(s);`,
    ask: 'Where is the camera?',
    choices: ['5 units straight above the center', '5 units to the side, level with the center', 'At the center, since phi is 0'],
    answer: 0,
    why: 'phi is measured down from straight up, so phi = 0 is directly above. Level with the center would be phi = a quarter turn (`Math.PI / 2`).',
  },
  {
    code: `// The orbit target is at (10, 0, 0)
camera.position.setFromSpherical(s);
camera.lookAt(target);`,
    ask: "What's wrong?",
    choices: [
      'It circles the origin instead of the target',
      'Nothing, the code is correct as written',
      'The spherical values need normalizing first',
    ],
    answer: 0,
    why: "`setFromSpherical` gives a position around (0, 0, 0). Add the target's position to move it around the target instead.",
  },
  {
    code: `spherical.phi = MathUtils.clamp(spherical.phi, 0.0001, Math.PI - 0.0001);`,
    ask: 'Why keep phi just away from 0 and half a turn?',
    choices: [
      'At the poles, theta stops meaning anything',
      'To stop the camera going below the floor',
      'To make zooming in and out smoother',
    ],
    answer: 0,
    why: "At the very top or bottom, every theta is the same point, so the camera can spin unpredictably. Staying a hair away keeps its orientation stable; this is what `makeSafe()` does, with an even smaller margin.",
  },
];
