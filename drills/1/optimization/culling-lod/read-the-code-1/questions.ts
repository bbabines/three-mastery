// Read-the-code questions for the culling and LOD page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const city = new Mesh(mergeGeometries(allBuildings), concrete); // 400 buildings
scene.add(city);
// the camera looks down one street, with 20 buildings in view`,
    ask: 'How many buildings go through the vertex shader?',
    choices: ['All 400, since the one mesh is in view', 'Only the 20 in view, after culling', 'Only the triangles facing the camera'],
    answer: 0,
    why: "Culling tests whole objects, and the merged city is one object that's always in view, so every vertex is processed. Merge by block instead, so blocks out of view are skipped.",
  },
  {
    code: `// the forest has been drawn; now tree 7 moves far east, and the camera turns to it
trees.setMatrixAt(7, farEastMatrix);
trees.instanceMatrix.needsUpdate = true;`,
    ask: 'What does the camera see?',
    choices: [
      'Tree 7, since needsUpdate refreshes the bounds',
      'Nothing, since the old sphere is out of view',
      'Tree 7, since each copy is culled on its own',
    ],
    answer: 1,
    why: "An InstancedMesh is culled as one object, by one sphere around its copies, and moving a copy doesn't update it. Call `trees.computeBoundingSphere()` after moving copies.",
  },
  {
    code: `lod.addLevel(detailed, 0);
lod.addLevel(simple, 20);
// the camera hovers about 20 units away, drifting a little closer and farther`,
    ask: 'What does the viewer see?',
    choices: [
      'The simple version, since it starts past 20',
      'The detailed version, picked only once',
      'The model popping between versions',
    ],
    answer: 2,
    why: "The LOD picks its level every frame from the camera's distance, so drifting across 20 swaps versions. `addLevel(simple, 20, 0.1)` adds hysteresis: it switches back only at 18.",
  },
];
