// Read-the-code questions for the updating buffers page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// the mesh has been on screen for a while
const position = mesh.geometry.attributes.position;
position.array[1] += 0.5; // raise vertex 0`,
    ask: 'What happens on screen?',
    choices: [
      'Vertex 0 rises: on the next frame',
      'three.js throws: the array is locked',
      'Nothing: the GPU keeps its old copy',
    ],
    answer: 2,
    why: 'The GPU draws from the copy it got at the first draw. Editing the array changes only the CPU copy. `position.needsUpdate = true` bumps its `version`, and the next render sends the array again.',
  },
  {
    code: `const geometry = new BufferGeometry().setFromPoints(routePoints); // 1000 points
const route = new Line(geometry, new LineBasicMaterial());
geometry.setDrawRange(0, 250);`,
    ask: 'What does the line show?',
    choices: ['Every fourth point of the route', 'The first quarter of the route', 'All of it, a quarter as bright'],
    answer: 1,
    why: "`setDrawRange(start, count)` draws only part of the geometry. With no index, `count` counts vertices, so it's the first 250 points. Raise `count` a little each frame and the route draws itself.",
  },
  {
    code: `// drawn already, with room for 1000 vertices
position.array = new Float32Array(2000 * 3); // make room for more
position.needsUpdate = true;`,
    ask: 'What happens on the next render?',
    choices: [
      'The mesh draws up to 2000 vertices',
      'three.js throws an error about the size',
      'Only the first 1000 vertices are drawn',
    ],
    answer: 1,
    why: 'The GPU buffer keeps the size it was made with, and three.js throws an error when an attribute\'s array no longer matches it. Allocate the most you\'ll ever need up front and use `setDrawRange` to show only the filled part.',
  },
];
