// Read-the-code questions for the face normals page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// a triangle on a smooth-shaded model: its three vertex normals lean different ways
const triangle = new Triangle().setFromAttributeAndIndices(position, a, b, c);
const n = triangle.getNormal(new Vector3());`,
    ask: 'What does `n` depend on?',
    choices: [
      'The average of its three vertex normals',
      'Only its corner positions and their order',
      'The vertex normal of the first corner, a',
    ],
    answer: 1,
    why: "`getNormal` reads only the three corners and the order they're listed in. The vertex normals live in a separate attribute that lighting reads, and they can lean any way, so their average can be well off the face normal.",
  },
  {
    code: `const n1 = Triangle.getNormal(a, b, c, new Vector3());
const n2 = Triangle.getNormal(a, c, b, new Vector3());`,
    ask: 'How do `n1` and `n2` compare?',
    choices: ['Equal: it is the same flat triangle', 'Opposite: the front has flipped', 'Same way: only their lengths differ'],
    answer: 1,
    why: 'Listing the corners in the other order swaps which side is the front, as on the winding order page, so the face normal points the other way. Both have length 1.',
  },
  {
    code: `// sign is a PlaneGeometry, turned 90° around Y; the ray hits its front
const hit = raycaster.intersectObject(sign)[0];
const normalMatrix = new Matrix3().getNormalMatrix(sign.matrixWorld);
const n = hit.face.normal.clone().applyNormalMatrix(normalMatrix);`,
    ask: 'What is `n`?',
    choices: ['(0, 0, 1)', '(0, 0, −1)', '(1, 0, 0)'],
    answer: 2,
    why: "`hit.face.normal` is (0, 0, 1), the plane's front measured from the sign itself. The normal matrix built from `matrixWorld` turns it with the sign, and a 90° turn around Y takes +Z to +X, so `n` is (1, 0, 0) in the world.",
  },
  {
    code: `rockGeometry.computeVertexNormals(); // smooth normals
const rock = new Mesh(rockGeometry, new MeshStandardMaterial({ flatShading: true }));`,
    ask: 'How does the rock look?',
    choices: [
      'Smooth: lighting reads the new normals',
      'Faceted: the shader ignores the normals',
      'Black: flat shading has no normals',
    ],
    answer: 1,
    why: "With `flatShading: true`, the shader works out each triangle's face normal on the GPU as it draws and never reads the `normal` attribute, so every triangle is lit evenly. Smooth vertex normals only matter with `flatShading: false`.",
  },
  {
    code: `// leaf uses side: DoubleSide; this ray hits it from behind
const hit = raycaster.intersectObject(leaf)[0];
console.log(hit.face.normal, hit.normal);`,
    ask: 'Which way does `hit.face.normal` point?',
    choices: [
      'Back toward the ray: it faces the hit side',
      'Nowhere: it is (0, 0, 0) for a back hit',
      'Out of the front: away from the ray',
    ],
    answer: 2,
    why: "`hit.face.normal` always points out of the triangle's front, whichever side the ray came from. `hit.normal`, the blended vertex normals, is turned to face the ray. Pick the one your code means.",
  },
];
