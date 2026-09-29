// Read-the-code questions for the frustum page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// One mesh holds a whole city block: 200,000 triangles.
// Only one corner of it is in view.
renderer.render(scene, camera);`,
    ask: 'How much of the block does the GPU work through?',
    choices: ['Only the triangles in view', 'All 200,000 triangles', 'None, since most of it is outside'],
    answer: 1,
    why: "Frustum culling tests each object's bounding sphere, not its triangles. The block's sphere touches the frustum, so the whole mesh is drawn: the GPU runs the vertex shader for all of it, then throws away what's outside the view. Split big meshes into pieces so culling can skip the ones out of view.",
  },
  {
    code: `const frustum = new Frustum().setFromProjectionMatrix(
  new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse),
);
const seen = frustum.intersectsObject(crate);`,
    ask: 'The crate is inside the view, but hidden behind a wall. What is `seen`?',
    choices: [
      "`true`: the frustum ignores what's in front",
      '`false`: the wall blocks the view',
      '`false`: the test needs a render first',
    ],
    answer: 0,
    why: "The frustum only knows the shape of the view, not what's in it. The crate's bounding sphere is inside, so the answer is `true`, and three.js would draw the crate too; the wall hides it pixel by pixel. Finding what's really visible takes a raycast.",
  },
  {
    code: `const pos = wave.geometry.attributes.position;
for (let i = 0; i < pos.count; i++) pos.setY(i, pos.getY(i) + 5); // lift every vertex 5 units
pos.needsUpdate = true;`,
    ask: 'The wave has been drawn before. Now the camera looks at where the vertices end up, and their old spot is out of view. What happens?',
    choices: [
      'It draws: needsUpdate refreshes the sphere',
      'It throws: the geometry changed shape',
      'It vanishes: its bounding sphere is stale',
    ],
    answer: 2,
    why: "three.js computed the bounding sphere once and kept it, so it still sits at the old spot, out of view, and the mesh is culled while its vertices are in plain sight. `needsUpdate` only sends the new positions to the GPU. Call `wave.geometry.computeBoundingSphere()` after the change, or set `wave.frustumCulled = false`.",
  },
];
