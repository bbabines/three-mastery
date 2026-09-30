// Read-the-code questions for the reading matrices page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const m = new Matrix4().makeTranslation(4, 2, -1);
console.log(m.elements[12], m.elements[13], m.elements[14]);`,
    ask: 'What does it log?',
    choices: ['1 0 0', '0 0 0', '4 2 −1'],
    answer: 2,
    why: "The move is the fourth column, stored last at indices 12 to 14. Indices 0 to 2 hold the object's own +X, (1, 0, 0) here.",
  },
  {
    code: `part.updateWorldMatrix(true, false);
console.log(part.matrixWorld.elements.slice(0, 3)); // [0, 0, -2]`,
    ask: 'What does the log say about the part?',
    choices: [
      "Its own +X points along the world's −Z, 2 long",
      "It sits 2 units along the world's −Z axis",
      "It's turned 2 radians around the Z axis",
    ],
    answer: 0,
    why: "Indices 0 to 2 are the first column: the part's own +X, as long as its X scale. Where it sits is in indices 12 to 14.",
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
    why: '`set` reads row by row, so the 5 ending the first row is a move along X. `elements` stores column by column, so the move is `elements[12]`, and `elements[3]` is 0.',
  },
  {
    code: `// source is moved to (2, 1, 0) and turned
copy.matrixAutoUpdate = false;
copy.matrix.set(...source.matrix.elements);`,
    ask: 'Where does `copy` end up?',
    choices: [
      'On top of source, turned the same way',
      "At its parent's origin, turned back and warped",
      'Nowhere, since set rejects an array spread',
    ],
    answer: 1,
    why: '`set` reads row by row, so this swaps rows and columns: the move lands in the bottom row and warps the shape. Use `copy.matrix.copy(source.matrix)`.',
  },
  {
    code: `group.scale.set(-1, 1, 1);
group.add(mesh);
mesh.scale.set(1, -1, -1);
group.updateMatrixWorld();
console.log(mesh.matrixWorld.determinant() < 0);`,
    ask: 'What does it log?',
    choices: [
      'true: three minus signs, an odd count',
      'false: the mesh has two, and they cancel',
      'false: only a mesh can mirror, not a group',
    ],
    answer: 0,
    why: "`matrixWorld` includes every parent, so the group's minus sign counts too: three in all, an odd count. The mesh's own `matrix.determinant()` would be 1.",
  },
];
