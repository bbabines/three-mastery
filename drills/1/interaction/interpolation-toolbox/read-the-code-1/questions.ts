// Read-the-code questions for the interpolation toolbox page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const t = MathUtils.clamp(elapsed / 0.6, 0, 1);
drawer.position.z = MathUtils.lerp(0, 0.4, t);`,
    ask: 'How does the drawer move?',
    choices: [
      'At one speed, starting and stopping abruptly',
      'Slowly at first, then easing into place',
      'Quickly at first, then slowing down near the end',
    ],
    answer: 0,
    why: '`t` grows at a steady rate and goes straight into the lerp, so the drawer moves at one speed from the first frame and stops dead at 0.4. Bend `t` first for a gentler move: `MathUtils.lerp(0, 0.4, MathUtils.smoothstep(t, 0, 1))`.',
  },
  {
    code: `// written like GLSL's smoothstep(edge0, edge1, x)
const eased = MathUtils.smoothstep(0, 1, t);`,
    ask: 'What is `eased` while `t` runs from 0 to 1?',
    choices: ['The same as smoothstep(t, 0, 1)', 'One minus the eased t, running backward', 'Always 0, so nothing moves'],
    answer: 2,
    why: "three.js's `smoothstep` takes the value first: `smoothstep(x, min, max)`. Here the value is 0 and the range starts at 1, and a value at or below `min` gives 0. Write `MathUtils.smoothstep(t, 0, 1)`.",
  },
  {
    code: `const volume = MathUtils.mapLinear(dragPixels, 0, 200, 0, 1);
// the user drags 300 pixels`,
    ask: 'What is `volume`?',
    choices: ["1.5, since mapLinear doesn't clamp", '1, since mapLinear stops at the end', '0.67, since 200 is 2/3 of 300'],
    answer: 0,
    why: '`mapLinear` carries straight on past the ends of the range, so 300 pixels maps to 1.5. Clamp it: `MathUtils.clamp(MathUtils.mapLinear(dragPixels, 0, 200, 0, 1), 0, 1)`.',
  },
];
