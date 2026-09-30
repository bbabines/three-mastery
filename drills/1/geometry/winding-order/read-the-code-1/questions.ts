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
    why: 'The front is where the corners run counter-clockwise on screen, and the normals only affect lighting. Swap two corners, `setIndex([0, 2, 1])`, to turn the front toward the camera.',
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
      'The culling: drawn and skipped faces swap',
    ],
    answer: 1,
    why: 'Culling reads the corner order, never the normals, so the same faces are drawn and skipped, now lit backward. Reverse the winding instead: swap two corners of every triangle.',
  },
  {
    code: `for (let i = 0; i < index.count; i += 3) {
  const b = index.getX(i + 1);
  index.setX(i + 1, index.getX(i + 2)).setX(i + 2, b);
}
index.needsUpdate = true;`,
    ask: 'What does the loop change?',
    choices: [
      'Which side of each triangle is its front',
      'Which way each vertex normal points',
      'Nothing, since the corners still draw',
    ],
    answer: 0,
    why: "Swapping two corners reverses each triangle's winding, so front and back trade places. The normals aren't touched; call `computeVertexNormals()` if they need to follow.",
  },
  {
    code: `// the camera is inside a room built from a BoxGeometry
const room = new Mesh(new BoxGeometry(8, 3, 6), new MeshStandardMaterial());
raycaster.setFromCamera(pointer, camera);
const hits = raycaster.intersectObject(room);`,
    ask: 'What does the camera see and hit?',
    choices: [
      'The wall ahead: drawn and hit from inside',
      'Every wall: the ray passes through them all',
      'None: every wall shows the camera its back',
    ],
    answer: 2,
    why: 'From inside, every wall shows its back, and with the default `FrontSide`, drawing and raycasting both skip backs. For a room you stand in, use `side: BackSide`.',
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
    why: 'A transparent `DoubleSide` material is drawn as two draw calls, backs then fronts, so the near side blends over the far side. `forceSinglePass: true` draws it once, possibly blending in the wrong order.',
  },
];
