// Read-the-code questions for the ray–triangle page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// Seen from the ray's start, a, b, c run clockwise.
const spot = ray.intersectTriangle(a, b, c, true, new Vector3());`,
    ask: 'The ray passes through the middle of the triangle. What is `spot`?',
    choices: [
      'The crossing point, since the flag only affects drawing',
      'The crossing point, moved onto the front side',
      '`null`, since the ray meets its back',
    ],
    answer: 2,
    why: "Clockwise as seen from the ray means the ray is looking at the triangle's back, and `true` for `backfaceCulling` skips backs. Pass `false` to test both sides.",
  },
  {
    code: `const hit = raycaster.intersectObject(mesh)[0];
console.log(hit.barycoord); // (0.7, 0.2, 0.1)`,
    ask: 'What does it tell you about the hit?',
    choices: ['It lies close to corner `a`, which weighs 70%', 'It lies 0.7 across and 0.2 up the triangle', "It's the direction the triangle faces"],
    answer: 0,
    why: 'The three numbers are how much of each corner, `a`, `b`, and `c`, the spot is made of, and they add up to 1. The biggest weight is the nearest corner. `hit.face.normal` is the direction it faces.',
  },
  {
    code: `const hit = raycaster.intersectObject(terrain)[0];
const { a, b, c } = hit.face;
const tint = Triangle.getInterpolatedAttribute(
  terrain.geometry.attributes.color, a, b, c, hit.barycoord, new Vector3());`,
    ask: 'What is `tint`?',
    choices: [
      'The average of the three corner colors, evenly weighted',
      'The vertex color blended at the exact hit spot',
      'The color of corner `a`, the first vertex',
    ],
    answer: 1,
    why: "The barycentric weights aren't just for finding the hit: they blend anything stored at the corners. three.js blends `hit.uv` and `hit.normal` the same way, and `getInterpolatedAttribute` does it for any attribute.",
  },
  {
    code: `sign.material.side = FrontSide; // the default
// The camera is behind the sign, looking at its back.
raycaster.setFromCamera(pointer, camera);
const hits = raycaster.intersectObject(sign);`,
    ask: 'The pointer is over the sign. What does `hits` hold?',
    choices: ['One hit on its back', 'One hit, with `face.normal` flipped toward you', 'An empty array, since backs are skipped'],
    answer: 2,
    why: "With `FrontSide`, the raycast skips triangles facing away from the ray, just as the renderer skips drawing them. Set `side: DoubleSide` to hit the sign from both sides.",
  },
  {
    code: `// mesh sits at x = 5; hit came from raycaster.intersectObject(mesh)
const pos = mesh.geometry.attributes.position;
const tri = new Triangle().setFromAttributeAndIndices(pos, hit.face.a, hit.face.b, hit.face.c);
const spot = raycaster.ray.intersectTriangle(tri.a, tri.b, tri.c, false, new Vector3());`,
    ask: 'The ray runs straight along −Z at x = 5.1, through the mesh. What is `spot`?',
    choices: [
      '`null`: it tests the triangle near the origin',
      '`hit.point` again: `Triangle` reads world positions',
      'An error: vertex numbers are not positions',
    ],
    answer: 0,
    why: "The corners come straight from the geometry, so they're measured from the mesh itself, as if it sat at the origin, while `raycaster.ray` is in the world. Move the ray into the mesh's space with `raycaster.ray.clone().applyMatrix4(mesh.matrixWorld.clone().invert())` first.",
  },
];
