// Read-the-code questions for the frustum page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// One mesh holds a whole city block: 200,000 triangles.
// Only one corner of it is in view.
renderer.render(scene, camera);`,
    ask: 'How many triangles does the GPU process?',
    choices: ['Only the triangles in view', 'All 200,000 triangles', 'None, since most of it is outside'],
    answer: 1,
    why: "Culling tests each object's bounding sphere, not its triangles. The block's sphere touches the frustum, so all of it is drawn. Split big meshes so culling can skip pieces.",
  },
  {
    code: `const frustum = new Frustum().setFromProjectionMatrix(
  new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse),
);
const seen = frustum.intersectsObject(crate); // in view, but behind a wall`,
    ask: 'What is `seen`?',
    choices: [
      "`true`: the frustum ignores what's in front",
      '`false`: the wall blocks the view',
      '`false`: the test needs a render first',
    ],
    answer: 0,
    why: "The frustum knows only the shape of the view, not what's in it, so the crate counts as in view. Finding what's really visible takes a raycast.",
  },
  {
    code: `const pos = wave.geometry.attributes.position;
for (let i = 0; i < pos.count; i++) pos.setY(i, pos.getY(i) + 5);
pos.needsUpdate = true;
// drawn before; now only the vertices' new spot is in view`,
    ask: 'What happens to the wave?',
    choices: [
      'It draws: needsUpdate refreshes the sphere',
      'It throws: the geometry changed shape',
      'It vanishes: its bounding sphere is stale',
    ],
    answer: 2,
    why: 'three.js computed the bounding sphere once, so it still sits at the old spot, out of view, and the mesh is culled. Call `computeBoundingSphere()` after the change.',
  },
];
