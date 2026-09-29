// Read-the-code questions for the ray–AABB page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const room = new Box3(new Vector3(-2, 0, -2), new Vector3(2, 3, 2));
const ray = new Ray(new Vector3(0, 1, 0), new Vector3(1, 0, 0)); // from the middle of the room
const spot = ray.intersectBox(room, new Vector3());`,
    ask: 'What is `spot`?',
    choices: ['(0, 1, 0), the start of the ray', '(2, 1, 0), where it leaves', '`null`, since the ray starts inside'],
    answer: 1,
    why: '`intersectBox` treats the box as solid. From inside, the first spot in front of the start where the ray touches it is the way out: the wall at x = 2.',
  },
  {
    code: `// roomMesh: a BoxGeometry around the same space, default material
raycaster.set(new Vector3(0, 1, 0), new Vector3(1, 0, 0));
const hits = raycaster.intersectObject(roomMesh);`,
    ask: 'What does `hits` hold?',
    choices: ['One hit, where the ray leaves the room', 'Two hits, one on each wall it passes', 'An empty array, as the walls face out'],
    answer: 2,
    why: "A mesh is tested triangle by triangle, and with the default `FrontSide` the ray sees the backs of walls that face outward, so it skips them. `side: BackSide` or `DoubleSide` would find the wall. `ray.intersectBox` has no such sides.",
  },
  {
    code: `const rackBox = new Box3().setFromObject(rack); // rack: a group of 300 meshes
if (!raycaster.ray.intersectsBox(rackBox)) return [];
return raycaster.intersectObject(rack);`,
    ask: 'When the ray misses the rack entirely, what does the first test save?',
    choices: [
      'A bounding-sphere test for each of the 300 parts',
      'Nothing, since three.js already boxes groups',
      'Only the triangle tests, not the sphere tests',
    ],
    answer: 0,
    why: "three.js tests each mesh's own bounding sphere, one by one, and has no box for a group. When the ray misses the rack's box, one test replaces 300. Triangle tests were already skipped for any part whose sphere was missed.",
  },
];
