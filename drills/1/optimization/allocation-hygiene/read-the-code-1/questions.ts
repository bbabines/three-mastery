// Read-the-code questions for the allocation hygiene page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `renderer.setAnimationLoop(() => {
  for (const tag of tags) { // 2,000 labels
    const offset = new Vector3(0, 0.3, 0);
    tag.position.copy(tag.userData.anchor).add(offset);
  }
  renderer.render(scene, camera);
});`,
    ask: 'The page stutters every few seconds, though nothing else is going on. What is the likely cause?',
    choices: [
      '120,000 throwaway vectors a second for the garbage collector',
      'Nothing here, since one small vector is too cheap to matter',
      'The labels being uploaded to the GPU again every frame',
    ],
    answer: 0,
    why: "Each frame makes 2,000 vectors that are garbage by the next one. Each is cheap to create, but the collector has to find and free them all, on the main thread, when the browser decides, and a frame that runs into a collection can miss its refresh. Make `offset` once, outside the loop.",
  },
  {
    code: `// inside the frame loop, for each of 300 drones
drone.position.add(velocity.clone().multiplyScalar(delta));      // a
drone.position.addScaledVector(velocity, delta);                 // b
drone.position.add(new Vector3().copy(velocity).multiplyScalar(delta)); // c`,
    ask: 'Which line moves the drones without creating an object?',
    choices: ['a, since clone is cheaper than a new Vector3', 'b, since addScaledVector works in place', 'All three, since three.js reuses vectors itself'],
    answer: 1,
    why: "`addScaledVector` adds velocity × delta straight into the position. `clone()` and `new Vector3()` both make a vector per drone per frame, 18,000 a second at 60 frames a second, all garbage. (Dropping the clone from line a would change `velocity` itself, the mistake from the point vs direction page.)",
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
    why: "`centerOf` returns the scratch vector itself, not a copy, so `a` and `b` are the same object, and the second call wrote shelfB's center into it. Let the caller pass a target in, `centerOf(part, target)`, or copy out what you keep.",
  },
  {
    code: `const hits = [];
canvas.addEventListener('pointermove', (event) => {
  raycaster.setFromCamera(toNdc(event), camera); // the pointer in NDC
  raycaster.intersectObjects(parts, true, hits);
  highlight(hits[0]?.object);
});`,
    ask: 'After the pointer has moved around for a while, what does `hits[0]` hold?',
    choices: [
      'The nearest part under the pointer right now',
      'The first part in the parts list, wherever the pointer is',
      'The nearest hit from any move so far, not just this one',
    ],
    answer: 2,
    why: "Passing an array reuses it, but `intersectObjects` only adds to it, then sorts everything in it by distance. Without `hits.length = 0` before each call, old hits pile up, the highlight sticks to the nearest part ever found, and the array grows with every move.",
  },
];
