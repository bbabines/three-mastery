// Read-the-code questions for the angle page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `forward.angleTo(targetOnLeft);  // 45° to the left
forward.angleTo(targetOnRight); // 45° to the right`,
    ask: 'What do these return?',
    choices: ['The same angle for both', 'A negative angle for the left one', 'A negative angle for the right one'],
    answer: 0,
    why: '`angleTo` gives only the amount, never the side. Use the signed angle recipe, or the sign of the cross product, to know which way.',
  },
  {
    code: `mesh.rotation.y = 90;`,
    ask: 'What does the mesh do?',
    choices: ['Turns 90 radians, not a quarter turn', 'Turns exactly a quarter turn, 90°', 'Nothing, rotations need MathUtils first'],
    answer: 0,
    why: 'three.js rotations are in radians, so it spins over 14 full turns and lands somewhere unexpected. A quarter turn is `MathUtils.degToRad(90)`, about 1.57.',
  },
  {
    code: `const side = new Vector3().crossVectors(forward, toTarget).y; // Y is up`,
    ask: '`side` is positive. Where is the target?',
    choices: ['To the left', 'To the right', 'Behind'],
    answer: 0,
    why: "With Y up, the cross product's up part is positive for targets on the left and negative on the right. Behind or ahead comes from the dot product instead.",
  },
  {
    code: `const angle = forward.angleTo(toTarget); // the target is 90° away
label.textContent = \`\${angle.toFixed(0)}°\`;`,
    ask: 'What does the label show?',
    choices: ['2°', '90°', '1.57°'],
    answer: 0,
    why: '`angleTo` returns radians, about 1.57 here, and `toFixed(0)` rounds that to 2. Convert with `MathUtils.radToDeg` before showing it.',
  },
];
