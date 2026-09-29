// Read-the-code questions for the culling and LOD page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const city = new Mesh(mergeGeometries(allBuildings), concrete); // 400 buildings
scene.add(city);
// the camera looks down one street, with 20 buildings in view`,
    ask: 'How much of the city does the GPU run the vertex shader for, each frame?',
    choices: [
      'All 400 buildings, since the one mesh is in view',
      'Only the 20 buildings in view, after culling',
      'Only the triangles that face the camera',
    ],
    answer: 0,
    why: "Culling tests whole objects by their bounding spheres, and the merged city is one object whose sphere is always in view, so every vertex goes through the GPU. Merge by block or by street instead: blocks out of view are skipped whole.",
  },
  {
    code: `// the forest has been drawn before; now move tree 7 far to the east
trees.setMatrixAt(7, farEastMatrix);
trees.instanceMatrix.needsUpdate = true;
// the camera turns east, where only tree 7 stands`,
    ask: 'What does the camera see?',
    choices: [
      "Tree 7, since needsUpdate also refreshes the forest's bounds",
      'Nothing, since the old bounds put the forest out of view',
      'Tree 7, since an InstancedMesh culls each copy on its own',
    ],
    answer: 1,
    why: "An InstancedMesh is culled as one object, by one sphere around all its copies, worked out the first time it was needed. Moving a copy doesn't update it, so the sphere still sits around the old forest, out of view. Call `trees.computeBoundingSphere()` after moving copies.",
  },
  {
    code: `lod.addLevel(detailed, 0);
lod.addLevel(simple, 20);
// the camera hovers about 20 units away, drifting 0.2 closer and farther`,
    ask: 'What does the viewer see?',
    choices: [
      'The simple version all along, since it starts past 20 units',
      'The detailed version, since a LOD picks its level only once',
      'The model switching versions back and forth as it drifts',
    ],
    answer: 2,
    why: "The renderer picks the level every frame from the camera's distance, so a camera drifting across 20 swaps the versions back and forth, with a visible pop each time. `lod.addLevel(simple, 20, 0.1)` adds hysteresis: once the simple version shows, it switches back only when the camera is 10% closer, at 18.",
  },
];
