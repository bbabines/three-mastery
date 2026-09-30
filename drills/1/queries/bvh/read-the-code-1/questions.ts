// Read-the-code questions for the BVH page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// scan: one Mesh of 200,000 triangles, no BVH
// the ray touches the scan's bounding sphere
raycaster.setFromCamera(pointer, camera);
const hits = raycaster.intersectObject(scan);`,
    ask: 'How many triangles does three.js test?',
    choices: ['Only the ones facing the camera', 'Only the ones near the pointer', 'All 200,000 of them, one after another'],
    answer: 2,
    why: 'Once the bounding sphere says "maybe", three.js has nothing finer to go on, so it tests every triangle. A BVH is what lets it skip most of them.',
  },
  {
    code: `function query(node, ray) {
  if (!ray.intersectsBox(node.box)) return; // misses: skip everything inside
  if (node.children) node.children.forEach((child) => query(child, ray));
  else testTriangles(node.triangles, ray);  // a box at the bottom
}`,
    ask: 'The ray misses the top box. How many triangles get tested?',
    choices: ['None, since one box test rules them all out', 'Only the triangles in the bottom boxes', 'All of them, since the box only saves time'],
    answer: 0,
    why: 'Every triangle is inside the top box, so missing it means missing them all. When the ray hits a box, the walk goes on down only into the boxes it hits.',
  },
  {
    code: `// A BVH was just built for the 2-million-triangle scan.
renderer.render(scene, camera);`,
    ask: 'What does the BVH change about drawing?',
    choices: ["It cuts the GPU's vertex work about in half", 'Nothing, since it only speeds up queries', 'It draws only triangles in boxes on screen'],
    answer: 1,
    why: 'A BVH answers questions about the mesh, like raycasts, collisions, and nearest points. The GPU still draws every triangle.',
  },
  {
    code: `// A BVH was built for the flat sheet. Then, with a ray aimed at the side of the new bump:
for (let i = 0; i < position.count; i++) position.setZ(i, bump(position.getX(i), position.getY(i)));
position.needsUpdate = true;`,
    ask: 'What does a raycast through the BVH find?',
    choices: [
      'The bump, since `needsUpdate` rebuilds the tree',
      'The bump, since the tree reads live positions',
      'Nothing, since the boxes fit the flat sheet',
    ],
    answer: 2,
    why: "`needsUpdate` only sends the new positions to the GPU. The tree's boxes still fit the flat sheet, so the ray skips the bump's triangles. Refit after moving vertices.",
  },
  {
    code: `const crate = new Mesh(new BoxGeometry(1, 1, 1), material); // 12 triangles
// A BVH is built for the crate's geometry.`,
    ask: 'What does the BVH save here?',
    choices: ['Next to nothing, with 12 triangles', 'Most of the 12 triangle tests', 'The bounding-sphere test three.js does first'],
    answer: 0,
    why: "With 12 triangles there's almost nothing to skip, and the box tests cost about as much as the triangles would. A BVH pays off on big meshes.",
  },
];
