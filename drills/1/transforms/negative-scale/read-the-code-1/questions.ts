// Read-the-code questions for the negative scale and determinant page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const leftDoor = new Group();
leftDoor.scale.x = -1; // mirrors everything inside it
leftDoor.add(panel, handle, hinge);`,
    ask: 'How do the panel, handle, and hinge draw?',
    choices: ['Mirrored, and right side out', 'Not mirrored, since only the group is', 'Mirrored, but inside out'],
    answer: 0,
    why: "Each child's `matrixWorld` includes the group's mirror, so its determinant is negative, and three.js swaps which side it hides for each of them. The children's own `matrix.determinant()` is still positive; three.js checks `matrixWorld`.",
  },
  {
    code: `const a = new Matrix4().makeScale(-1, 1, 1);
const b = new Matrix4().makeScale(-1, -1, 1);
console.log(a.determinant() < 0, b.determinant() < 0);`,
    ask: 'What does it log?',
    choices: ['true false', 'true true', 'false false'],
    answer: 0,
    why: "One minus sign mirrors, so `a`'s determinant is −1. Two minus signs cancel: `b` is a half turn around Z, which doesn't mirror, so its determinant is 1. An odd number of minus signs mirrors; an even number doesn't.",
  },
  {
    code: `const geometry = bracket.geometry.clone();
geometry.scale(-1, 1, 1); // for the left-hand version
const left = new Mesh(geometry, bracket.material);`,
    ask: 'How does `left` look when it renders?',
    choices: [
      'A correct mirror image of the bracket',
      'Inside out, showing its inner faces',
      'Not mirrored, since only the mesh can mirror',
    ],
    answer: 1,
    why: "The points are mirrored, but each triangle's corners are still in the old order, so every triangle shows its back to the outside. `left.matrixWorld.determinant()` is positive, so three.js has nothing to fix. Mirror with `left.scale.x = -1` instead, or reverse every triangle's corners after baking.",
  },
];
