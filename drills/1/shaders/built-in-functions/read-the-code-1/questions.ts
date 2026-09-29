// Read-the-code questions for the built-in functions page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `float f = fract(vUv.y * 5.0);
gl_FragColor = vec4(vec3(f), 1.0);`,
    ask: 'What do you see on the plane, from bottom to top?',
    choices: [
      'One smooth fade from black to white',
      'Five dark-to-light fades, one after another',
      'Five hard black and white stripes',
    ],
    answer: 1,
    why: "`vUv.y * 5.0` climbs from 0 to 5 up the plane, and `fract` keeps only the part after the decimal point, so it climbs 0 to 1 five times, dropping back to 0 each time. Shown as brightness, that's five fades with a hard jump between them. Hard stripes need a cut on top: `step(0.5, f)`.",
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
    why: "`step` takes one edge; `smoothstep` takes two, where the fade starts and where it ends, and then the value. With only two arguments there's no matching `smoothstep`, and the shader fails to compile. Soft stripes are `smoothstep(0.45, 0.55, f)`: the fade runs from 0.45 to 0.55.",
  },
  {
    code: `float h = vWorldPos.y;
float above = step(h, 1.0);
gl_FragColor = vec4(vec3(above), 1.0);`,
    ask: 'Where is the part white?',
    choices: [
      'Below height 1: the arguments are swapped',
      "Above height 1: that's what the name says it does",
      'At height 1 only: a thin line there',
    ],
    answer: 0,
    why: "`step(edge, x)` is 1 once `x` reaches `edge`. Here the edge is `h` and the value is 1.0, so it's 1 wherever 1.0 has reached `h`: wherever the height is 1 or less. Put the edge first for \"at or above 1\": `step(1.0, h)`. Both versions compile, which is why the swap is easy to miss.",
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
    why: '`smoothstep(1.0, 3.0, d)` is 0 inside 1, 1 past 3, and fades between. `1.0 - …` flips it, so the mask is 1 near the center and 0 far away, and `mix` picks the glow where the mask is 1. That\'s a spotlight-style falloff; without the `1.0 -`, the glow would start at 1 and grow outward.',
  },
  {
    code: `float m = mod(-0.5, 2.0);`,
    ask: 'What is `m`?',
    choices: ['−0.5', '1.5', '0.5'],
    answer: 1,
    why: "GLSL's `mod(x, y)` is `x - y * floor(x / y)`, so the result always has the sign of `y`: −0.5 wraps around to 1.5, and a repeating pattern carries on smoothly across zero. JavaScript's `-0.5 % 2` gives −0.5, so porting between the two can put a stripe in a different place for negative numbers.",
  },
];
