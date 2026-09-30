// Read-the-code questions for the built-in functions page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `float f = fract(vUv.y * 5.0);
gl_FragColor = vec4(vec3(f), 1.0);`,
    ask: 'What do you see, from bottom to top?',
    choices: [
      'One smooth fade from black to white',
      'Five dark-to-light fades in a row',
      'Five hard black and white stripes',
    ],
    answer: 1,
    why: '`fract` keeps the part after the decimal point, so the value climbs from 0 to 1 five times, dropping back each time. Hard stripes need `step(0.5, f)` on top.',
  },
  {
    code: `// before: float s = step(0.5, f);
float s = smoothstep(0.5, f); // soften the stripes`,
    ask: 'What happens?',
    choices: [
      'Softer: the stripes get faded edges',
      "It won't compile: smoothstep needs two edges",
      "Nothing changes: it's the same function",
    ],
    answer: 1,
    why: '`smoothstep` takes two edges, where the fade starts and where it ends, and then the value. Soft stripes are `smoothstep(0.45, 0.55, f)`.',
  },
  {
    code: `float h = vWorldPos.y;
float above = step(h, 1.0);
gl_FragColor = vec4(vec3(above), 1.0);`,
    ask: 'Where is the part white?',
    choices: [
      'Below height 1: the arguments are swapped',
      'Above height 1: as the name says',
      'At height 1 only: a thin line there',
    ],
    answer: 0,
    why: "`step(edge, x)` is 1 once `x` reaches the edge. Here the edge is `h`, so it's white wherever the height is 1 or less; write `step(1.0, h)`.",
  },
  {
    code: `float d = distance(vWorldPos.xz, uCenter);
float mask = 1.0 - smoothstep(1.0, 3.0, d);
gl_FragColor = vec4(mix(uFloor, uGlow, mask), 1.0);`,
    ask: 'What does the floor look like?',
    choices: [
      'A glowing ring between 1 and 3, dark inside',
      'Full glow out to 1, fading to none by 3',
      'Dark out to 1, then glowing more and more',
    ],
    answer: 1,
    why: '`smoothstep(1.0, 3.0, d)` climbs from 0 at 1 to 1 at 3, and `1.0 -` flips it. So the glow is full near the center and gone past 3.',
  },
  {
    code: `float m = mod(-0.5, 2.0);`,
    ask: 'What is `m`?',
    choices: ['−0.5', '1.5', '0.5'],
    answer: 1,
    why: "GLSL's `mod` always has the sign of the second number, so −0.5 wraps around to 1.5. JavaScript's `-0.5 % 2` gives −0.5, so a ported pattern can shift for negative numbers.",
  },
];
