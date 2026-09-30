// Read-the-code questions for the bounds primitives page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const wall = new Plane(new Vector3(1, 0, 0), 0); // faces +X, at x = 0
console.log(wall.distanceToPoint(new Vector3(-3, 1, 0)));`,
    ask: 'What does it log?',
    choices: ['3.16', '−3', '3'],
    answer: 1,
    why: "A plane's distance is signed: positive on the side its normal points to, negative on the other. The point is 3 units behind the wall. `Math.abs` gives the plain distance.",
  },
  {
    code: `const a = new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 1));
const b = new Box3(new Vector3(1, 0, 0), new Vector3(2, 1, 1)); // right beside a
console.log(a.intersectsBox(b));`,
    ask: 'What does it log?',
    choices: ['`false`, since they only share a face', '`false`, since b starts where a ends', '`true`, since touching counts as overlapping'],
    answer: 2,
    why: '`intersectsBox` counts boxes that only touch as overlapping. To let crates sit flush, shrink one a hair first with `expandByScalar(-0.001)`.',
  },
  {
    code: `const bubble = new Sphere(new Vector3(0, 0, 0), 2);
console.log(bubble.distanceToPoint(new Vector3(0.5, 0, 0)));`,
    ask: 'What does it log?',
    choices: ['−1.5, in from the surface', '0, since the point is inside it', '1.5, the gap to the surface'],
    answer: 0,
    why: "A sphere's distance is measured to its surface and goes negative inside. A `Box3`'s gives 0 anywhere inside instead.",
  },
];
