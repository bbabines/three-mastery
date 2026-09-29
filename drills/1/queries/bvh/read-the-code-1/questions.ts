// Read-the-code questions for the BVH page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// scan: one Mesh of 200,000 triangles, no BVH
raycaster.setFromCamera(pointer, camera);
const hits = raycaster.intersectObject(scan);`,
    ask: "The ray touches the scan's bounding sphere. How many triangles does three.js test?",
    choices: ['Only the ones facing the camera', 'Only the ones near the pointer', 'All 200,000, one after another'],
    answer: 2,
    why: "Once the bounding sphere says \"maybe\", three.js has nothing finer to go on, so it tests every triangle in the mesh. A BVH is what lets it skip most of them.",
  },
  {
    code: `function query(node, ray) {
  if (!ray.intersectsBox(node.box)) return;       // misses: skip everything inside
  if (node.children) node.children.forEach((child) => query(child, ray));
  else testTriangles(node.triangles, ray);        // a box at the bottom
}`,
    ask: "The ray misses the top box, the one around the whole mesh. How many triangles get tested?",
    choices: ['None, since one box test rules them all out', 'Only the triangles in the bottom boxes', 'All of them, since the box only saves time'],
    answer: 0,
    why: 'Every triangle is inside the top box, so missing it means missing them all: one box test and done. When the ray does hit a box, the walk goes on down, but only into the boxes it hits.',
  },
  {
    code: `// A BVH was just built for the 2-million-triangle scan.
renderer.render(scene, camera);`,
    ask: 'What does the BVH change about drawing the scan each frame?',
    choices: ["It cuts the GPU's vertex work about in half", 'Nothing, since it only speeds up queries', 'It draws only triangles in boxes on screen'],
    answer: 1,
    why: 'A BVH answers questions about the mesh, like raycasts, collisions, and nearest points. The GPU still draws every triangle; making the scan draw faster is the optimization domain\'s job.',
  },
  {
    code: `// A BVH was built for the flat sheet. Then:
for (let i = 0; i < position.count; i++) position.setZ(i, bump(position.getX(i), position.getY(i)));
position.needsUpdate = true;`,
    ask: 'A ray aims at the side of the new bump. What does a raycast through the BVH find?',
    choices: [
      'The bump, since `needsUpdate` rebuilds the tree',
      'The bump, since the tree reads live positions',
      'Nothing, since the boxes fit the flat sheet',
    ],
    answer: 2,
    why: "`needsUpdate` sends the new positions to the GPU; the tree's boxes still fit the flat sheet, so a ray that passes the bump outside them skips its triangles. Refit the tree after moving vertices.",
  },
  {
    code: `const crate = new Mesh(new BoxGeometry(1, 1, 1), material); // 12 triangles
// A BVH is built for the crate's geometry.`,
    ask: 'What does the BVH save on raycasts against the crate?',
    choices: ['Next to nothing, with 12 triangles', 'Most of the 12 triangle tests', 'The bounding-sphere test three.js does first'],
    answer: 0,
    why: "With 12 triangles there's almost nothing to skip, and the box tests cost about as much as the triangles would. A BVH pays off on big meshes, and still costs time to build.",
  },
];
