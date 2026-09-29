// Read-the-code questions for the branching and discard page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// the part straddles x = 0; marble() and wood() are both long patterns
if (vWorldPos.x > 0.0) color = marble(vWorldPos);
else color = wood(vWorldPos);`,
    ask: 'For pixels near the seam at x = 0, what does the GPU work out?',
    choices: [
      'One: each pixel runs only its own side',
      'Often both: neighbors in a group disagree there',
      'Neither: the if is decided once per draw call',
    ],
    answer: 1,
    why: "As a rule of thumb, the GPU runs a group of neighboring pixels in lockstep. Near the seam, some pixels in a group want marble and some want wood, so the group runs both patterns and each pixel keeps its own answer. Away from the seam, groups agree and run one side. An `if` on a uniform always agrees, which is why that kind is cheap.",
  },
  {
    code: `// the panel's material is not transparent
if (hole > 0.5) gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);`,
    ask: 'What do the holes look like?',
    choices: ['Black dots: alpha is ignored here', 'Real holes: alpha 0 is see-through', 'Gray: the alpha blends the colors'],
    answer: 0,
    why: "Without `transparent: true`, three.js turns blending off for the material, so the alpha is never used and the fragment paints black like any other color. `if (hole > 0.5) discard;` throws the fragment away instead, with no color and no depth, and whatever is behind the panel shows through.",
  },
  {
    code: `// 40 perforated panels, one behind another
panel.material.alphaTest = 0.5;`,
    ask: 'Most of the panels are hidden behind the front ones. Why can this still be slow?',
    choices: [
      'alphaTest makes every panel transparent and sorted',
      'alphaTest runs on the CPU, once for every pixel',
      'discard can stop the GPU skipping hidden fragments',
    ],
    answer: 2,
    why: "`alphaTest` adds a `discard` to the fragment shader. Whether a fragment survives isn't known until the shader has run, so the GPU can lose its early depth test and shade the hidden panels' fragments too, layer after layer. The depth buffer and early-z page covers why; the overdraw reduction page in the optimization domain covers what to do.",
  },
];
