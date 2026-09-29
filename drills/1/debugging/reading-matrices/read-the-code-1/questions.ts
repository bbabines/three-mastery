// Read-the-code questions for the reading matrices page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const m = new Matrix4().makeTranslation(4, 2, -1);
console.log(m.elements[12], m.elements[13], m.elements[14]);`,
    ask: 'What does it log?',
    choices: ['1 0 0', '0 0 0', '4 2 −1'],
    answer: 2,
    why: "A matrix keeps its move in the fourth column, which is stored last: indices 12, 13, and 14. The first column, indices 0 to 3, is the object's own +X axis, (1, 0, 0) here.",
  },
  {
    code: `part.updateWorldMatrix(true, false);
console.log(part.matrixWorld.elements.slice(0, 3)); // [0, 0, -2]`,
    ask: 'What does the log say about the part?',
    choices: [
      "Its own +X points along the world's −Z, 2 long",
      "It sits 2 units out along the world's negative Z axis",
      "It's turned 2 radians around the Z axis",
    ],
    answer: 0,
    why: "Indices 0 to 2 are the first column: where the part's own +X points, as long as its X scale. So it's turned so its +X faces −Z (a quarter turn around Y), and stretched 2 times along its own X. Where it sits is in indices 12 to 14.",
  },
  {
    code: `const m = new Matrix4().set(
  1, 0, 0, 5,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
);
console.log(m.elements[3], m.elements[12]);`,
    ask: 'What does it log?',
    choices: ['5 0', '0 5', '5 5'],
    answer: 1,
    why: "`set` takes its numbers row by row, the way the matrix is written on paper, so the 5 at the end of the first row is a move of 5 along X. `elements` stores column by column, so that move is `elements[12]`, and `elements[3]`, the bottom of the first column, is 0.",
  },
  {
    code: `// source is moved to (2, 1, 0) and turned
copy.matrixAutoUpdate = false;
copy.matrix.set(...source.matrix.elements);`,
    ask: 'Where does `copy` end up?',
    choices: [
      'On top of source, turned the same way',
      'At its parent’s origin, turned the other way and warped',
      'Nowhere, since set rejects an array spread',
    ],
    answer: 1,
    why: "`elements` is column by column and `set` reads row by row, so this swaps rows and columns. The move (2, 1, 0) lands in the bottom row, where it warps the shape instead of moving it, and the turn comes out reversed. Use `copy.matrix.copy(source.matrix)`, or `fromArray(source.matrix.elements)`.",
  },
  {
    code: `group.scale.set(-1, 1, 1);
group.add(mesh);
mesh.scale.set(1, -1, -1);
group.updateMatrixWorld();
console.log(mesh.matrixWorld.determinant() < 0);`,
    ask: 'What does it log?',
    choices: [
      'true: three minus signs in all, an odd count',
      'false: the mesh has two, and they cancel out',
      'false: only a mesh can mirror, not a group',
    ],
    answer: 0,
    why: "`matrixWorld` includes every parent, so the mirror check counts the group's minus sign too: three in all. An odd count mirrors, and the determinant comes out −1. The mesh's own `matrix.determinant()` would be 1, because its two cancel.",
  },
];
