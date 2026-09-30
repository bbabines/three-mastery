// Read-the-code questions for the types and precision page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `uniform float uStrength;
void main() {
  float s = uStrength * 2;
  // …`,
    ask: 'What happens?',
    choices: [
      'Nothing odd: s is uStrength doubled',
      "It won't compile: 2 is an int, not a float",
      'It compiles: s gets rounded to a whole number',
    ],
    answer: 1,
    why: '`2` is an int and `uStrength` is a float, and GLSL never converts between them for you. Write `uStrength * 2.0`.',
  },
  {
    code: `int total = 3;
float middle = float(total / 2);`,
    ask: 'What is `middle`?',
    choices: ['1.5', '1.0', "It won't compile"],
    answer: 1,
    why: '`total / 2` divides two ints, so the half is dropped before `float()` runs. Convert first: `float(total) / 2.0` is 1.5.',
  },
  {
    code: `// a kiosk page stays open for weeks; its shader uses sin(uTime * 3.0)
// after two weeks, the animation moves in jerks
material.uniforms.uTime.value = timer.getElapsed();`,
    ask: 'Why does it move in jerks?',
    choices: [
      'Precision: uTime is too big to step smoothly',
      'Drift: the timer slows down after a few days',
      'Limits: uniforms stop updating past 65,504',
    ],
    answer: 0,
    why: "Near 1.2 million seconds, a 32-bit float can only step in jumps of 0.125, so the GPU's time jerks. Wrap it in JavaScript: `timer.getElapsed() % (2 * Math.PI / 3)`.",
  },
];
