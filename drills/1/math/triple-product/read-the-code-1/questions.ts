// Read-the-code questions for the triple product page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const normal = new Vector3().crossVectors(b.clone().sub(a), c.clone().sub(a));
const side = normal.dot(point.clone().sub(a));`,
    ask: '`side` is negative. Where is the point?',
    choices: ['Behind the triangle', 'In front of the triangle', 'Exactly on the triangle'],
    answer: 0,
    why: 'A negative dot product means the move from the triangle to the point partly opposes the normal, so the point is on the side the triangle faces away from.',
  },
  {
    code: `const mirrored = xAxis.dot(new Vector3().crossVectors(yAxis, zAxis)) < 0;`,
    ask: 'When is `mirrored` true?',
    choices: [
      'When it has a scale of −1 on one axis',
      'When it faces away from the camera view',
      'When it has been turned upside down',
    ],
    answer: 0,
    why: "Turning an object, even upside down, keeps its axes arranged the normal way. Only a flip, like a negative scale, reverses them, and this check's sign catches it.",
  },
];
