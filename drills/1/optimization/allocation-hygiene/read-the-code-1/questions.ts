// Read-the-code questions for the allocation hygiene page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// every frame, for 2,000 labels; the page stutters every few seconds
for (const tag of tags) {
  const offset = new Vector3(0, 0.3, 0);
  tag.position.copy(tag.userData.anchor).add(offset);
}`,
    ask: 'What is the likely cause of the stutter?',
    choices: [
      '120,000 throwaway vectors a second',
      'Nothing here, since one vector is cheap',
      'The labels uploading again every frame',
    ],
    answer: 0,
    why: 'Each frame makes 2,000 vectors that are garbage by the next. The collector frees them on the main thread, and a frame that runs into it can miss its refresh. Make `offset` once.',
  },
  {
    code: `// every frame, for each of 300 drones
drone.position.add(velocity.clone().multiplyScalar(delta));             // a
drone.position.addScaledVector(velocity, delta);                        // b
drone.position.add(new Vector3().copy(velocity).multiplyScalar(delta)); // c`,
    ask: 'Which line creates no new object?',
    choices: ['a, since clone is cheaper than new', 'b, since addScaledVector works in place', 'All three, since three.js reuses them'],
    answer: 1,
    why: '`addScaledVector` adds velocity times delta straight into the position. `clone()` and `new Vector3()` each make a vector per drone per frame, all garbage.',
  },
  {
    code: `const _center = new Vector3();
const _box = new Box3();
const centerOf = (part) => _box.setFromObject(part).getCenter(_center);
const a = centerOf(shelfA);
const b = centerOf(shelfB);`,
    ask: 'What does `a` hold after the last line?',
    choices: ["shelfB's center, since a and b are one vector", "shelfA's center, since it was worked out first", 'Zeros, since the box was reset for shelfB'],
    answer: 0,
    why: '`centerOf` returns the scratch vector itself, so `a` and `b` are the same object, and the second call overwrote it. Let the caller pass a target in.',
  },
  {
    code: `const hits = []; // made once, reused on every pointer move
raycaster.intersectObjects(parts, true, hits);
highlight(hits[0]?.object);`,
    ask: 'After many moves, what is `hits[0]`?',
    choices: [
      'The nearest part under the pointer now',
      'The first part in the parts list',
      'The nearest hit from any move so far',
    ],
    answer: 2,
    why: '`intersectObjects` only adds to the array you pass, then sorts all of it by distance, so old hits pile up. Set `hits.length = 0` before each call.',
  },
];
