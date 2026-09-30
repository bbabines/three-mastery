// Read-the-code questions for the ray–sphere page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const bubble = new Sphere(new Vector3(0, 0, 0), 2);
const ray = new Ray(new Vector3(0, 0, 0), new Vector3(1, 0, 0)); // starts at the center
const spot = ray.intersectSphere(bubble, new Vector3());`,
    ask: 'What is `spot`?',
    choices: ["(0, 0, 0), the ray's own start", '(2, 0, 0), where the ray comes out', '`null`, since the ray starts inside'],
    answer: 1,
    why: 'Starting inside, the ray still touches the sphere on its way out. `intersectSphere` gives the nearest spot in front of the start: here the exit, 2 units along.',
  },
  {
    code: `const hotspot = new Sphere(dot.getWorldPosition(new Vector3()), 0.3);
const over = raycaster.ray.intersectsSphere(hotspot);`,
    ask: 'What is `over`?',
    choices: ['The spot where the ray enters the hotspot', 'How far along the ray the hotspot is', 'A boolean, whether the ray touches it'],
    answer: 2,
    why: '`intersectsSphere`, with an s, only answers yes or no. `intersectSphere(hotspot, target)` gives the spot.',
  },
  {
    code: `mesh.position.set(10, 0, 0);
mesh.updateMatrixWorld();
mesh.geometry.computeBoundingSphere();
// the ray passes straight through the mesh
const touches = raycaster.ray.intersectsSphere(mesh.geometry.boundingSphere);`,
    ask: 'What is `touches`?',
    choices: [
      '`false`: the sphere is still around the origin',
      '`true`: the sphere moved along with the mesh',
      '`true`: every ray touches a bounding sphere',
    ],
    answer: 0,
    why: '`geometry.boundingSphere` is measured from the object itself, so it still sits around (0, 0, 0). Test a clone moved with `applyMatrix4(mesh.matrixWorld)` instead.',
  },
];
