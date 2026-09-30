// Read-the-code questions for the branching and discard page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// the part straddles x = 0; marble() and wood() are both long patterns
if (vWorldPos.x > 0.0) color = marble(vWorldPos);
else color = wood(vWorldPos);`,
    ask: 'What does the GPU work out near the seam?',
    choices: [
      'One: each pixel runs only its own side',
      'Often both: neighbors in a group disagree',
      'Neither: the if is decided once per draw',
    ],
    answer: 1,
    why: 'The GPU usually runs a group of neighboring pixels in lockstep, so a group that straddles the seam runs both patterns. An `if` on a uniform always agrees, so it stays cheap.',
  },
  {
    code: `// the panel's material is not transparent
if (hole > 0.5) gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);`,
    ask: 'What do the holes look like?',
    choices: ['Black dots: alpha is ignored here', 'Real holes: alpha 0 is see-through', 'Gray: the alpha blends the colors'],
    answer: 0,
    why: 'Without `transparent: true`, blending is off, so the alpha is ignored and the fragment paints black. `if (hole > 0.5) discard;` makes a real hole.',
  },
  {
    code: `// 40 perforated panels, one behind another; most are hidden
panel.material.alphaTest = 0.5;`,
    ask: 'Why can this still be slow?',
    choices: [
      'alphaTest makes every panel transparent and sorted',
      'alphaTest runs on the CPU, once for every pixel',
      'discard can stop the GPU skipping hidden fragments',
    ],
    answer: 2,
    why: "`alphaTest` adds a `discard`, so whether a fragment survives isn't known until its shader runs. The GPU can lose its early depth test and shade every hidden layer, so keep stacked cutouts few.",
  },
];
