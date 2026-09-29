// Read-the-code questions for the winding order page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// seen from the camera, corners 0 → 1 → 2 run clockwise,
// and all three vertex normals point at the camera
geometry.setIndex([0, 1, 2]);
const tri = new Mesh(geometry, new MeshStandardMaterial()); // side: FrontSide`,
    ask: 'Does the camera see the triangle?',
    choices: ['Yes: its normals face the camera', 'Yes: a lone triangle draws both sides', 'No: the camera sees its back side'],
    answer: 2,
    why: "The front is the side where the corners run counter-clockwise, and the GPU decides that from where the corners land on screen. The normals only affect lighting. Swap two corners, `setIndex([0, 2, 1])`, to turn the front toward the camera.",
  },
  {
    code: `// the model imports inside out
const normal = geometry.attributes.normal;
for (let i = 0; i < normal.count; i++) normal.setXYZ(i, -normal.getX(i), -normal.getY(i), -normal.getZ(i));
normal.needsUpdate = true;`,
    ask: 'What does this change?',
    choices: [
      'Everything: the model turns right side out',
      'Only the lighting: the same faces are skipped',
      'The culling: the drawn faces and the skipped ones swap',
    ],
    answer: 1,
    why: "Culling reads the corner order, never the normals, so the same faces are drawn and skipped as before, now lit as if they faced the other way. Reverse the winding instead: swap two corners of every triangle in the index.",
  },
  {
    code: `for (let i = 0; i < index.count; i += 3) {
  const b = index.getX(i + 1);
  index.setX(i + 1, index.getX(i + 2));
  index.setX(i + 2, b);
}
index.needsUpdate = true;`,
    ask: 'What does the loop change?',
    choices: [
      'Which side of each triangle is its front',
      'Which way each vertex normal points',
      'Nothing, since the corners still draw',
    ],
    answer: 0,
    why: "Swapping two corners reverses the triangle's winding, so its front and back trade places. The `normal` attribute isn't touched; call `computeVertexNormals()` afterward if the normals need to follow.",
  },
  {
    code: `// the camera is inside a room built from a BoxGeometry
const room = new Mesh(new BoxGeometry(8, 3, 6), new MeshStandardMaterial());
raycaster.setFromCamera(pointer, camera);
const hits = raycaster.intersectObject(room);`,
    ask: 'What does the ray hit, and what does the camera see?',
    choices: [
      'The wall ahead: drawn and hit from inside',
      'Every wall: the ray passes through them all',
      'None: every wall shows the camera its back',
    ],
    answer: 2,
    why: "From inside, every wall shows the camera its back, and with the default `FrontSide` both drawing and raycasting skip backs. For a room you stand in, use `side: BackSide`, which draws and hits the insides.",
  },
  {
    code: `const glass = new MeshPhysicalMaterial({
  transparent: true, opacity: 0.3, side: DoubleSide,
});
const vase = new Mesh(vaseGeometry, glass);`,
    ask: 'How does three.js draw the vase?',
    choices: [
      'Once: both sides in a single draw call',
      'Twice: the back faces, then the front faces',
      'Once: the front faces only, as usual',
    ],
    answer: 1,
    why: "A transparent `DoubleSide` material is drawn in two passes, backs then fronts, so the near side blends over the far side. That's two draw calls. `forceSinglePass: true` draws it once, and the sides may then blend in the wrong order.",
  },
];
