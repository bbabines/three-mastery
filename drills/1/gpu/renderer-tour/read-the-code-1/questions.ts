// Read-the-code questions for the renderer settings tour. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const renderer = new WebGLRenderer();
// later, when the shopper picks "high quality":
renderer.antialias = true;`,
    ask: 'What happens to the jagged edges?',
    choices: [
      'Nothing, since it was read at creation',
      'They smooth out from the next frame on',
      'An error, since antialias is read-only',
    ],
    answer: 0,
    why: 'The renderer reads `antialias` once, when it connects to the GPU, so the assignment just adds an unused property. Pass `{ antialias: true }` to the constructor.',
  },
  {
    code: `renderer.shadowMap.enabled = true;
sun.castShadow = true;
floor.receiveShadow = true;
scene.add(sun, floor, rack);`,
    ask: 'Does the rack cast a shadow on the floor?',
    choices: [
      'Yes, since the renderer, light, and floor are set',
      'No, since the rack meshes need castShadow too',
      'Only once the materials have recompiled',
    ],
    answer: 1,
    why: '`castShadow` defaults to `false` on every mesh, and the shadow pass draws only meshes that have it. Set it on each rack mesh, with `traverse` for a loaded model.',
  },
  {
    code: `// a phone with devicePixelRatio 3
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(400, 800);`,
    ask: 'How many pixels, compared with ratio 1?',
    choices: [
      'The same, since setSize says 400 × 800',
      '3 times as many, since the ratio is 3',
      '9 times as many, 1200 × 2400 in all',
    ],
    answer: 2,
    why: "The canvas draws 1200 × 2400 device pixels, so the cost grows with the ratio's square. `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))` caps it at 4 times.",
  },
];
