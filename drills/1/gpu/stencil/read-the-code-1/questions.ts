// Read-the-code questions for the stencil buffer page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const renderer = new WebGLRenderer({ antialias: true });
part.material.stencilWrite = true; part.material.stencilRef = 1;
part.material.stencilZPass = ReplaceStencilOp;
rim.material.stencilWrite = true; rim.material.stencilRef = 1;
rim.material.stencilFunc = NotEqualStencilFunc; // rim.renderOrder = 1`,
    ask: 'The rim covers the whole part instead of outlining it. Why?',
    choices: [
      'Outlines need post-processing: stencil tricks never work',
      'The renderer has no stencil buffer: it needs stencil: true',
      'The rim must be drawn first: renderOrder is backwards',
    ],
    answer: 1,
    why: 'three.js creates the renderer without a stencil buffer unless you pass `stencil: true`, and then the stencil settings on materials quietly do nothing: the rim draws everywhere its bigger shape covers. With `new WebGLRenderer({ antialias: true, stencil: true })` the same materials give an outline, one extra draw call and no post-processing.',
  },
  {
    code: `// stencil: true on the renderer; the part already wrote 1
rim.material.stencilRef = 1;
rim.material.stencilFunc = NotEqualStencilFunc;
// rim.material.stencilWrite is left at its default, false`,
    ask: 'What does the rim draw?',
    choices: [
      'Only the outline: the test needs no switch to read',
      'Its whole shape: stencilWrite is the on switch',
      'Nothing at all: the stencil hides it everywhere',
    ],
    answer: 1,
    why: 'In three.js, `stencilWrite` switches the stencil on for a material, the test as well as the writing, despite its name. Left at `false`, the rim ignores the stencil and draws its whole bigger shape over the part. A material that only reads still needs `stencilWrite: true`, with the default `stencilZPass: KeepStencilOp` so it writes nothing.',
  },
];
