// Read-the-code questions for the multisampling page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const renderer = new WebGLRenderer({ antialias: true });
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new OutputPass());`,
    ask: 'Are the final edges antialiased?',
    choices: [
      "No, since the composer's targets have none",
      'Yes, since antialias covers every render',
      'Yes, since OutputPass smooths them',
    ],
    answer: 0,
    why: "`antialias: true` multisamples only the canvas, and the composer's targets default to `samples: 0`. Give it a target with `samples: 4`, or end with an `FXAAPass`.",
  },
  {
    code: `const target = new WebGLRenderTarget(w, h, { type: HalfFloatType, samples: 4 });
const composer = new EffectComposer(renderer, target);`,
    ask: 'What does `samples: 4` mainly cost?',
    choices: [
      'Nothing, since the display does the smoothing',
      'GPU memory, for 4 colors and depths a pixel',
      'Shading, since the shader runs 4 times a pixel',
    ],
    answer: 1,
    why: 'Each sample keeps its own color and depth, so the buffers take about 4 times the memory. The fragment shader usually still runs about once per pixel for each triangle.',
  },
  {
    code: `const cable = new Line(
  new BufferGeometry().setFromPoints([start, end]),
  new LineBasicMaterial({ color: 'yellow', linewidth: 3 }),
);`,
    ask: 'How wide is the cable drawn?',
    choices: [
      'One pixel, since WebGL ignores linewidth',
      '3 pixels, the width it was given',
      '3 units, since linewidth is in world units',
    ],
    answer: 0,
    why: 'WebGL almost always draws lines one pixel wide, whatever `linewidth` says. For real thickness, use `Line2` with `LineMaterial`, which builds the line from triangles.',
  },
];
