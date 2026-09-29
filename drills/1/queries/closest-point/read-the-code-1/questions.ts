// Read-the-code questions for the closest-point queries page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const tri = new Triangle(new Vector3(0, 0, 0), new Vector3(10, 0, 0), new Vector3(0, 10, 0));
const spot = tri.closestPointToPoint(new Vector3(3, 3, 5), new Vector3());`,
    ask: 'What is `spot`?',
    choices: ['(3, 3, 0), straight across on the face', '(0, 0, 0), the nearest corner', '(3.33, 3.33, 0), the middle of the triangle'],
    answer: 0,
    why: "The point hangs 5 above the triangle's face, so the nearest spot is straight across from it, in the middle of the face. The nearest corner, (0, 0, 0), is farther away.",
  },
  {
    code: `const rail = new Line3(new Vector3(0, 0, 0), new Vector3(4, 0, 0));
const spot = rail.closestPointToPoint(new Vector3(6, 2, 0), false, new Vector3());`,
    ask: 'What is `spot`?',
    choices: ['(6, 2, 0), the point itself', '(6, 0, 0), past the end of the rail', '(4, 0, 0), the end of the rail'],
    answer: 1,
    why: "`false` treats the `Line3` as a line that goes on forever, so the nearest spot can be past its ends. Pass `true` to keep it on the segment, which gives (4, 0, 0) here.",
  },
  {
    code: `const crate = new Box3(new Vector3(-1, 0, -1), new Vector3(1, 2, 1));
const spot = crate.clampPoint(new Vector3(0.2, 1, 0.3), new Vector3());`,
    ask: 'What is `spot`?',
    choices: ['(1, 1, 0.3), on the nearest side', "(0, 1, 0), the box's center", '(0.2, 1, 0.3), the point itself'],
    answer: 2,
    why: "The point is already inside the box, and the nearest spot in a solid box to a point inside it is the point itself. From outside, `clampPoint` gives the nearest spot on the box's surface.",
  },
];
