// Read-the-code questions for the BufferAttribute and itemSize page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const position = new BufferAttribute(new Float32Array(30), 3);
console.log(position.count);`,
    ask: 'What does it log?',
    choices: ['30', '10', '90'],
    answer: 1,
    why: "`count` is the number of vertices: the array's length divided by `itemSize`. 30 numbers, 3 per vertex, make 10 vertices.",
  },
  {
    code: `const position = geometry.attributes.position; // itemSize 3
const x = position.array[7];`,
    ask: 'Is `x` the x of vertex 7?',
    choices: ['Yes: array index 7 is vertex 7', 'No: it is the x of vertex 21', 'No: it is the y value of vertex 2'],
    answer: 2,
    why: "Each vertex takes 3 numbers, so vertex 2 fills indices 6 to 8, and index 7 is its y. `position.getX(7)` does the math and reads vertex 7's x.",
  },
  {
    code: `// arm has moved to (2, 0, 0) since it was built
const tip = new Vector3().fromBufferAttribute(arm.geometry.attributes.position, 5);
marker.position.copy(tip); // marker is added straight to the scene`,
    ask: 'Where does the marker go?',
    choices: [
      'On vertex 5 of the arm: it reads the corner',
      'Off the arm: the numbers ignore where it moved',
      "At (2, 0, 0): the vertex is the arm's origin",
    ],
    answer: 1,
    why: 'Vertex positions are measured from the arm itself, so `tip` ignores where the arm moved. Call `arm.localToWorld(tip)` first to get the corner in the world.',
  },
  {
    code: `const colors = new BufferAttribute(new Float32Array(position.count * 3), 3);
geometry.setAttribute('color', colors);
colors.setXYZ(4, 1, 0, 0); // vertex 4: red
const mesh = new Mesh(geometry, new MeshStandardMaterial());`,
    ask: "Vertex 4 doesn't show red. Why?",
    choices: [
      'The material has `vertexColors` off',
      'The values have to run from 0 to 255',
      "Vertex 4's red is at array index 4",
    ],
    answer: 0,
    why: 'A material ignores the `color` attribute unless `vertexColors` is `true`. `setXYZ` already finds vertex 4, and colors run from 0 to 1.',
  },
  {
    code: `const sway = new Float32Array(position.count);
geometry.setAttribute('sway', new BufferAttribute(sway, 1));
sway[12] = 0.8;`,
    ask: 'Which vertex gets a sway of 0.8?',
    choices: ['Vertex 4', 'Vertex 36', 'Vertex 12'],
    answer: 2,
    why: "With an `itemSize` of 1, each vertex has exactly one number, so array index 12 is vertex 12. That's the only case where the two match.",
  },
];
