// Read-the-code questions for the scene statistics page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const material = new MeshStandardMaterial({ color: 'gray' });
for (let i = 0; i < 100; i++) {
  scene.add(new Mesh(boltGeometry, material));
}
// all 100 bolts are in the camera's view`,
    ask: 'How many draw calls do the bolts add?',
    choices: ['100: one for every Mesh drawn', '1: they all share one material', '2: one for the geometry, one for the material'],
    answer: 0,
    why: 'Shared geometry and material are stored once, but three.js still draws each Mesh on its own: 100 draw calls every frame. `InstancedMesh` draws many copies in one call.',
  },
  {
    code: `// every geometry in the model is indexed
let triangles = 0;
model.traverse((object) => {
  if (object.isMesh) triangles += object.geometry.attributes.position.count / 3;
});`,
    ask: 'How does `triangles` compare with the real count?',
    choices: [
      'Too high: each corner is stored three times',
      'Exact: every triangle has three corners',
      'Too low: shared corners are stored only once',
    ],
    answer: 2,
    why: 'An indexed geometry stores each corner once, and neighboring triangles share corners through the index. Count `geometry.index.count / 3` for indexed geometry.',
  },
  {
    code: `// in view: a rack of 20 opaque Meshes, the floor grid,
// and one label Sprite
renderer.render(scene, camera);`,
    ask: 'What is `renderer.info.render.calls` now?',
    choices: ['20', '22', '21'],
    answer: 1,
    why: '`renderer.info` counts everything the render drew, not just your model: 20 Meshes, the grid, and the Sprite. Hide helpers, or subtract them, before comparing numbers.',
  },
];
