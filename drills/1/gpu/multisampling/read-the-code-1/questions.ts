// Read-the-code questions for the multisampling page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const renderer = new WebGLRenderer({ antialias: true });
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new OutputPass());`,
    ask: 'Are the edges in the final picture antialiased?',
    choices: [
      "No: the composer's targets have no samples",
      'Yes: antialias: true covers every render',
      'Yes: OutputPass smooths the edges as it copies',
    ],
    answer: 0,
    why: '`antialias: true` multisamples only the canvas. The composer draws the scene into its own render targets, which default to `samples: 0`, and OutputPass just copies and converts that jagged picture onto the canvas. Pass the composer a target with `samples: 4`, or end the chain with an `FXAAPass` or `SMAAPass`.',
  },
  {
    code: `const target = new WebGLRenderTarget(w, h, { type: HalfFloatType, samples: 4 });
const composer = new EffectComposer(renderer, target);`,
    ask: 'What does `samples: 4` mainly cost?',
    choices: [
      'Nothing: the display does the smoothing',
      'GPU memory: 4 colors and depths per pixel',
      'Shading: the fragment shader runs 4 times',
    ],
    answer: 1,
    why: 'Each sample keeps its own color and depth, so the multisampled buffers take about 4 times the memory of a plain target, and the composer makes two such targets. As a rule of thumb, MSAA runs the fragment shader about once per pixel per triangle and tests only coverage and depth at every sample; running the shader for every sample is supersampling, a different and costlier technique.',
  },
  {
    code: `const cable = new Line(
  new BufferGeometry().setFromPoints([start, end]),
  new LineBasicMaterial({ color: 'yellow', linewidth: 3 }),
);`,
    ask: 'How wide is the cable drawn?',
    choices: [
      'One pixel: WebGL ignores linewidth',
      '3 pixels: the width it was given',
      '3 units: linewidth is in world units',
    ],
    answer: 0,
    why: 'three.js\'s docs say WebGL ignores `linewidth` and always draws line primitives one pixel wide. That also makes lines the first thing to look jagged without multisampling. For real thickness, use `Line2` with `LineMaterial` from `three/addons/lines/`, which builds the line from triangles.',
  },
];
