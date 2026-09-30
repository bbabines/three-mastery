// Read-the-code questions for the InstancedMesh page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// seatGeometry has two groups: the cushion (0) and the frame (1)
const seats = new InstancedMesh(seatGeometry, [fabric, leather], 500);`,
    ask: 'Which seats get `leather`?',
    choices: [
      'Every second seat, taking turns',
      "Every seat's frame, through the groups",
      'Only seats picked with setColorAt',
    ],
    answer: 1,
    why: "Every copy shares the materials, and an array works through the geometry's groups, so every seat has a leather frame. For some seats in leather, use a second InstancedMesh.",
  },
  {
    code: `// after the first render: pull bin 4 far out of the rack
bins.setMatrixAt(4, pulledOut);
bins.instanceMatrix.needsUpdate = true;
const hits = raycaster.intersectObject(bins); // aimed right at bin 4's new spot`,
    ask: 'Why can `hits` come back empty?',
    choices: [
      'Raycasts skip the copies of an InstancedMesh',
      'The GPU has not drawn the new spot yet',
      "The InstancedMesh's own bounds are stale",
    ],
    answer: 2,
    why: "A raycast tests the InstancedMesh's bounding sphere first, and moving a copy doesn't update it, so the ray misses. Call `bins.computeBoundingSphere()` after moving copies.",
  },
  {
    code: `const hit = raycaster.intersectObject(seats)[0];
seats.setColorAt(hit.instanceId, new Color('red'));
seats.instanceColor.needsUpdate = true;`,
    ask: 'What turns red?',
    choices: [
      'Every seat, since they share a material',
      'Nothing until the material is cloned',
      'The one seat the ray hit',
    ],
    answer: 2,
    why: "`hit.instanceId` says which copy the ray hit, and `setColorAt` tints just that copy. The material stays shared; the copy's color multiplies its color.",
  },
];
