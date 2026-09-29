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
    why: "In GLSL, `2` is an int and `uStrength` is a float, and GLSL never converts between them for you, so the multiply is a compile error. Write `uStrength * 2.0`. JavaScript has only one kind of number, which is why the missing `.0` is easy to miss.",
  },
  {
    code: `int total = 3;
float middle = float(total / 2);`,
    ask: 'What is `middle`?',
    choices: ['1.5', '1.0', "It won't compile"],
    answer: 1,
    why: "`total / 2` is an int divided by an int, so the answer is an int too: 1, with the half dropped. `float()` then turns 1 into 1.0. Convert first to keep the half: `float(total) / 2.0` is 1.5. The line compiles, because `float()` is a conversion you asked for.",
  },
  {
    code: `// a kiosk page stays open for weeks; its shader animates with sin(uTime * 3.0)
material.uniforms.uTime.value = timer.getElapsed();`,
    ask: 'After a couple of weeks, the animation moves in jerks. Why?',
    choices: [
      'Precision: uTime is too big to step smoothly',
      'Drift: the timer slows down after a few days',
      'Limits: uniforms stop updating past 65,504',
    ],
    answer: 0,
    why: "Two weeks is about 1.2 million seconds, and a 32-bit float that big can only step in jumps of 0.125, so the GPU's time moves in jerks while JavaScript's stays smooth. Keep the number small in JavaScript, whose numbers are 64-bit: `timer.getElapsed() % (2 * Math.PI / 3)` repeats exactly as often as `sin(uTime * 3.0)` does.",
  },
];
