// Read-the-code questions for the floating-point tolerance page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `if (0.1 + 0.2 === 0.3) console.log('equal');`,
    ask: 'What prints?',
    choices: ['Nothing, the sum is slightly off', "'equal', since the sum is 0.3", 'An error about comparing floats'],
    answer: 0,
    why: 'Both numbers are rounded when stored, and the sum comes out as 0.30000000000000004. Compare with a tolerance instead of `===`.',
  },
  {
    code: `const moved = point.clone().applyAxisAngle(up, Math.PI * 2); // one full turn
moved.equals(point);`,
    ask: 'A full turn brings the point back to where it started. What does `equals` return?',
    choices: ['false, off by a tiny rounding error', 'true, a full turn lands exactly back', 'It depends on the frame rate'],
    answer: 0,
    why: 'The turned point comes back off by about 0.0000000000000002, and `equals` has no tolerance. Use `moved.distanceTo(point) < 1e-6`.',
  },
  {
    code: `// a and b are float32 vertex positions near x = 5000 that should match
const match = a.distanceTo(b) < 1e-6;`,
    ask: 'Is 1e-6 a good tolerance here?',
    choices: ['No, the float32 gaps there are bigger', 'Yes, a smaller tolerance is always safer', "It doesn't matter for vertex positions"],
    answer: 0,
    why: 'Near 5000, float32 values are about 0.0005 apart, so real matches fail. A tolerance has to be bigger than the gaps at the numbers you compare.',
  },
  {
    code: `if (new Triangle(a, b, c).getArea() === 0) skip();`,
    ask: "What's the risk?",
    choices: ['Nearly flat triangles slip through', 'None, a flat triangle always gives exactly 0', '`getArea` never returns exactly 0'],
    answer: 0,
    why: 'A nearly flat triangle has a tiny area, not exactly 0, and rounding rarely produces an exact 0. Compare against a small tolerance, like `< 1e-10`.',
  },
];
