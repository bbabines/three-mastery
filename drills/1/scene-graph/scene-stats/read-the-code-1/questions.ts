// Read-the-code questions for the scene statistics page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const material = new MeshStandardMaterial({ color: 'gray' });
for (let i = 0; i < 100; i++) {
  scene.add(new Mesh(boltGeometry, material));
}
// all 100 bolts are in the camera's view`,
    ask: 'How many draw calls do the bolts add to each render?',
    choices: ['100: one for every Mesh drawn', '1: they all share one material', '2: one for the geometry, one for the material'],
    answer: 0,
    why: 'Sharing a geometry and a material means the GPU stores them once, but three.js still draws each Mesh on its own: 100 draw calls, CPU work every frame. Drawing many copies in one call is what `InstancedMesh` is for.',
  },
  {
    code: `// every geometry in the model is indexed
let triangles = 0;
model.traverse((object) => {
  if (object.isMesh) triangles += object.geometry.attributes.position.count / 3;
});`,
    ask: 'How does `triangles` compare with the real triangle count?',
    choices: [
      'Too high: every corner is stored three times',
      "Exact: every triangle has three corners",
      'Too low: shared corners are stored only once',
    ],
    answer: 2,
    why: 'An indexed geometry stores each corner once and lists which corners make each triangle in its index, so neighboring triangles share corners. Count `geometry.index.count / 3` for indexed geometry. On the rack, dividing the vertex count by 3 gives about half the real 61,455.',
  },
  {
    code: `// in view: a rack of 20 opaque Meshes, the floor grid,
// and one label Sprite
renderer.render(scene, camera);
console.log(renderer.info.render.calls);`,
    ask: 'What does it log?',
    choices: ['20', '22', '21'],
    answer: 1,
    why: '`renderer.info` counts everything the render drew, not just your model: 20 Meshes, 1 for the grid, and 1 for the Sprite. Hide helpers, or subtract them, before comparing numbers.',
  },
];
