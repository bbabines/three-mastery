// Read-the-code questions for the ray–plane page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const floor = new Plane(new Vector3(0, 1, 0), 0);
const ray = new Ray(new Vector3(0, 2, 0), new Vector3(1, 0, 0));
const hit = ray.intersectPlane(floor, new Vector3());`,
    ask: 'What is `hit`?',
    choices: ['`null`, since the ray never comes down', '(0, 0, 0), the floor straight below the start', 'A point very far away along X'],
    answer: 0,
    why: 'The ray runs level, 2 above the floor, so it never reaches it. Parallel rays and rays pointing away miss even an endless plane.',
  },
  {
    code: `const floor = new Plane(new Vector3(0, 1, 0), 0);
const ray = new Ray(new Vector3(0, 3, 0), new Vector3(0.6, 0.8, 0)); // up and to the right
const hit = ray.intersectPlane(floor, new Vector3());`,
    ask: 'What is `hit`?',
    choices: ['(2.25, 0, 0), ahead along the line', '`null`, since the floor is behind the ray', '(−2.25, 0, 0), where its line meets the floor'],
    answer: 1,
    why: 'Going up from 3 above the floor, the ray only gets farther away. Its line crosses the floor behind the start, and a ray only runs forward.',
  },
  {
    code: `// the pointer has moved above the horizon
raycaster.setFromCamera(pointer, camera);
raycaster.ray.intersectPlane(floor, spot);
ghost.position.copy(spot);`,
    ask: 'What does the ghost do?',
    choices: [
      'Jumps to the far edge, at the horizon',
      'Jumps to (0, 0, 0), since `spot` is reset',
      'Stays put, since `spot` keeps its last value',
    ],
    answer: 2,
    why: 'Above the horizon the ray never reaches the floor, so `intersectPlane` returns `null` and leaves `spot` untouched. Check the result before copying it.',
  },
  {
    code: `const tableTop = new Plane(new Vector3(0, 1, 0), 0.8);`,
    ask: 'At what height is this plane?',
    choices: ['y = −0.8, below the floor', 'y = 0.8, the table top', 'y = 0, with a thicker normal'],
    answer: 0,
    why: 'The constant is minus the height along the normal, so 0.8 puts the plane at y = −0.8. Use −0.8, or build it with `setFromNormalAndCoplanarPoint`.',
  },
  {
    code: `// floorMesh: a 10 × 10 PlaneGeometry laid flat at y = 0
// the ray comes down to y = 0 about 14 units from the middle
const hits = raycaster.intersectObject(floorMesh);
const hit = raycaster.ray.intersectPlane(floor, spot);`,
    ask: 'What do the two tests find?',
    choices: [
      'Neither finds anything, since it misses the floor',
      '`hits` is empty, and `hit` is the spot 14 out',
      'Both find the same spot, 14 units out',
    ],
    answer: 1,
    why: 'The mesh stops at its edges, 5 units out, so the raycast finds nothing. The plane goes on forever, so `intersectPlane` finds the spot.',
  },
];
