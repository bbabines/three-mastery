// Read-the-code questions for the AABB vs OBB page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// plank: a BoxGeometry(2, 0.2, 0.2)
plank.rotation.y = Math.PI / 4; // turned 45°
plank.updateMatrixWorld();
const size = new Box3().setFromObject(plank).getSize(new Vector3());`,
    ask: 'What is `size`, roughly?',
    choices: ['(1.56, 0.2, 1.56)', '(2, 0.2, 0.2)', '(1.41, 0.2, 0.14)'],
    answer: 0,
    why: "A `Box3` stays lined up with the world's axes, so it grows to hold the plank's corners at 45°: about 1.56 on both X and Z.",
  },
  {
    code: `const snug = new Box3().setFromObject(plank, true); // the same turned plank`,
    ask: 'Does `snug` fit the turned plank tightly?',
    choices: [
      'Yes, since it wraps every vertex exactly',
      'No, since it still runs along the world axes',
      'Yes, since `true` turns the box with the plank',
    ],
    answer: 1,
    why: "`true` works from every vertex instead of each part's own box, which helps round shapes. But a `Box3` can't turn, so it's just as big. That takes an OBB.",
  },
  {
    code: `// both planks: bounding boxes computed, side by side 0.4 apart, turned 45°
const a = new OBB().fromBox3(plankA.geometry.boundingBox).applyMatrix4(plankA.matrixWorld);
const b = new OBB().fromBox3(plankB.geometry.boundingBox).applyMatrix4(plankB.matrixWorld);
console.log(a.intersectsOBB(b));`,
    ask: 'What does it log?',
    choices: ['`true`, the same as their Box3s', '`false`, the same as their Box3s', '`false`, though their Box3s overlap'],
    answer: 2,
    why: 'Each OBB turns with its plank and sees the 0.4 gap. The `Box3`s, lined up with the axes, grow into each other at 45° and report an overlap that isn\'t there.',
  },
];
