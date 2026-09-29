// Read-the-code questions for the renderer settings tour. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const renderer = new WebGLRenderer();
// later, when the shopper picks "high quality":
renderer.antialias = true;`,
    ask: 'What happens to the jagged edges?',
    choices: [
      'Nothing: the renderer reads it only once',
      'Edges smooth out: the next frame draws with it',
      'It throws an error: antialias is read-only',
    ],
    answer: 0,
    why: 'The renderer reads `antialias` once, when it creates its WebGL connection, and keeps no setting you can change afterwards. The assignment just adds an unused property, with no error. To offer antialiasing, pass `{ antialias: true }` to the constructor, or create a new renderer (which uploads and compiles everything again).',
  },
  {
    code: `renderer.shadowMap.enabled = true;
sun.castShadow = true;
floor.receiveShadow = true;
scene.add(sun, floor, rack);`,
    ask: 'Does the rack cast a shadow on the floor?',
    choices: [
      'Yes: the renderer, the light, and the floor are set up',
      'No: each of the rack meshes needs castShadow too',
      'Later: once the materials have recompiled',
    ],
    answer: 1,
    why: '`castShadow` defaults to `false` on every mesh, and the shadow pass only draws meshes that have it on. It takes all four: `shadowMap.enabled`, the light\'s `castShadow`, `castShadow` on each casting mesh (use `traverse` for a loaded model), and `receiveShadow` on the surfaces the shadow falls on.',
  },
  {
    code: `// a phone with devicePixelRatio 3
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(400, 800);`,
    ask: 'How many pixels does each frame draw, compared with a pixel ratio of 1?',
    choices: [
      'The same: setSize says 400 × 800',
      '3 times as many: the ratio is 3',
      '9 times as many: 1200 × 2400 device pixels',
    ],
    answer: 2,
    why: 'The canvas draws `400 × 3` by `800 × 3` device pixels, so the pixel count grows with the ratio squared: 9 times the GPU work for every pixel, and 9 times the memory for the canvas. `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))` caps it at 4 times.',
  },
];
