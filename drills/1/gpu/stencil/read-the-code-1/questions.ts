// Read-the-code questions for the stencil buffer page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const renderer = new WebGLRenderer({ antialias: true });
part.material.stencilWrite = true; part.material.stencilRef = 1;
part.material.stencilZPass = ReplaceStencilOp;
rim.material.stencilWrite = true; rim.material.stencilRef = 1;
rim.material.stencilFunc = NotEqualStencilFunc; // rim.renderOrder = 1`,
    ask: 'Why does the rim cover the whole part?',
    choices: [
      'Outlines need post-processing to work',
      'The renderer has no stencil buffer',
      'The rim needs a lower renderOrder',
    ],
    answer: 1,
    why: 'three.js creates the renderer without a stencil buffer unless you ask, and then stencil settings quietly do nothing. Add `stencil: true` to the constructor.',
  },
  {
    code: `// stencil: true on the renderer; the part already wrote 1
rim.material.stencilRef = 1;
rim.material.stencilFunc = NotEqualStencilFunc;
// rim.material.stencilWrite is left at its default, false`,
    ask: 'What does the rim draw?',
    choices: [
      'Only the outline, since reading needs no switch',
      'Its whole shape, since stencilWrite is the switch',
      'Nothing, since the stencil hides it everywhere',
    ],
    answer: 1,
    why: "`stencilWrite` switches the stencil on for a material, testing included, despite its name. A material that only reads still needs it, and the default `stencilZPass` writes nothing.",
  },
];
