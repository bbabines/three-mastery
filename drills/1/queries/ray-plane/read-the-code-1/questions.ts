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
    why: "The ray runs level, 2 above the floor, parallel to it, so it never reaches it, however far it goes. An endless plane isn't hit by every ray: parallel ones and ones pointing away miss it.",
  },
  {
    code: `const floor = new Plane(new Vector3(0, 1, 0), 0);
const ray = new Ray(new Vector3(0, 3, 0), new Vector3(0.6, 0.8, 0)); // up and to the right
const hit = ray.intersectPlane(floor, new Vector3());`,
    ask: 'What is `hit`?',
    choices: ['(2.25, 0, 0), ahead along the line', '`null`, since the floor is behind the ray', '(−2.25, 0, 0), where its line meets the floor'],
    answer: 1,
    why: "Going up from 3 above the floor, the ray only gets farther away. The line it lies on does cross the floor, but behind the start, and a ray only runs forward.",
  },
  {
    code: `raycaster.setFromCamera(pointer, camera);
raycaster.ray.intersectPlane(floor, spot);
ghost.position.copy(spot);`,
    ask: 'The pointer moves above the horizon. What does the ghost do?',
    choices: [
      'Jumps to the far edge of the floor, at the horizon',
      'Jumps to (0, 0, 0), since `spot` is reset',
      'Stays where it was, since `spot` keeps its last value',
    ],
    answer: 2,
    why: "Above the horizon, the ray never comes down to the floor, so `intersectPlane` returns `null` and leaves `spot` untouched. Check the result: `if (raycaster.ray.intersectPlane(floor, spot)) ghost.position.copy(spot)`.",
  },
  {
    code: `const tableTop = new Plane(new Vector3(0, 1, 0), 0.8);`,
    ask: 'At what height is this plane?',
    choices: ['y = −0.8, below the floor', 'y = 0.8, the table top', 'y = 0, with a thicker normal'],
    answer: 0,
    why: "The constant is minus the height along the normal, so 0.8 puts the plane at y = −0.8. `new Plane(new Vector3(0, 1, 0), -0.8)` is the table top, or build it with `new Plane().setFromNormalAndCoplanarPoint(new Vector3(0, 1, 0), new Vector3(0, 0.8, 0))`.",
  },
  {
    code: `// floorMesh: a 10 × 10 PlaneGeometry laid flat at y = 0
const hits = raycaster.intersectObject(floorMesh);
const hit = raycaster.ray.intersectPlane(floor, spot);`,
    ask: 'The ray comes down to y = 0 about 14 units away. What do they find?',
    choices: [
      'Neither finds anything, since it misses the floor',
      '`hits` is empty, and `hit` is the spot 14 away',
      'Both find the same spot, 14 units away',
    ],
    answer: 1,
    why: "The mesh stops at its edges, 5 units out, so the raycast finds nothing. The plane goes on forever, so `intersectPlane` finds the spot. For dragging on a floor, the plane is the one you want.",
  },
];
