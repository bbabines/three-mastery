// Read-the-code questions for the bounding box and sphere page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const shelf = new Mesh(new BoxGeometry(2, 0.1, 0.6), material); // 2 wide
shelf.position.set(5, 0, 0);
shelf.geometry.computeBoundingBox();
console.log(shelf.geometry.boundingBox.min.x);`,
    ask: 'What does it log?',
    choices: ['4', '−1', '5'],
    answer: 1,
    why: "The geometry's box is measured from the shelf itself, so its position never enters into it: 2 wide and centered gives −1. The box in the world would start at 4.",
  },
  {
    code: `// the mesh has already been drawn, so its bounds exist
position.setY(10, 3); // pull one vertex far above the rest
position.needsUpdate = true;`,
    ask: 'What is still out of date?',
    choices: [
      'The position data on the GPU',
      'The bounding box and sphere',
      'Nothing, since the bounds follow along',
    ],
    answer: 1,
    why: '`needsUpdate` sends the new positions to the GPU, but a direct edit never touches the stored bounds. Call `computeBoundingBox()` and `computeBoundingSphere()`, or culling and raycasts use the old shape.',
  },
  {
    code: `// the mesh is turned 45° around Y
mesh.updateMatrixWorld();
const box = mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld);`,
    ask: 'How does `box` fit the turned mesh?',
    choices: [
      'Exactly, hugging the turned shape',
      'Turned 45°, along with the mesh',
      'Loosely, as a level box around it',
    ],
    answer: 2,
    why: 'A `Box3` is always lined up with the axes, so `applyMatrix4` fits a level box around the turned corners, bigger than the shape. `setFromObject(mesh, true)` fits tighter.',
  },
];
