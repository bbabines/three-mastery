// Read-the-code questions for the disposal ownership page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// each swap loads the next variant and takes the old one out
scene.remove(oldVariant);
scene.add(newVariant);
console.log(renderer.info.memory.geometries); // climbs with every swap`,
    ask: 'Why does the count keep climbing?',
    choices: [
      'remove takes a model out of the scene, but its GPU copies stay',
      "The garbage collector hasn't gotten to the old variants yet",
      'renderer.info counts every geometry the page ever made',
    ],
    answer: 0,
    why: "Removing a model only stops it being drawn. Its geometries, materials, and textures stay on the GPU, and the renderer keeps its records of them, which is what this count reads, until you call `dispose()` on each. Dispose the old variant's resources after removing it, and the count stays flat.",
  },
  {
    code: `// mesh.material.map is a 2048 × 2048 texture
scene.remove(mesh);
mesh.geometry.dispose();
mesh.material.dispose();`,
    ask: "What's still on the GPU?",
    choices: [
      'The texture: material.dispose() leaves its maps',
      'Nothing: disposing a material frees its maps too',
      'The geometry: it stays until the next render',
    ],
    answer: 0,
    why: "`material.dispose()` frees the material's own GPU state, its shader program, but not the textures it points to, which other materials might share. Call `mesh.material.map.dispose()` too, or collect every texture from the model and dispose each once.",
  },
  {
    code: `const copyB = copyA.clone(); // both racks on screen
scene.remove(copyA);
copyA.traverse((object) => {
  if (object.isMesh) { object.geometry.dispose(); object.material.dispose(); }
});`,
    ask: 'What happens to copyB on the next frame?',
    choices: [
      'It still draws, and its geometry uploads all over again',
      'It disappears, since its geometry was deleted',
      'Nothing changes, since copyB has its own copies',
    ],
    answer: 0,
    why: "The clone shares copyA's geometries and materials, so those were disposed while copyB still draws them. three.js doesn't break: the next render uploads the geometry and compiles the shaders again, the same stall as the first time. Dispose only what nothing else still uses.",
  },
  {
    code: `scene.remove(rack);
rack.dispose(); // r186: every Object3D has a dispose() method`,
    ask: 'What does `rack.dispose()` free?',
    choices: [
      'None of its geometries, materials, or textures',
      'Everything the rack and its children use on the GPU',
      "Only the geometry of the rack's own mesh",
    ],
    answer: 0,
    why: "`Object3D.dispose()` only announces that the object is being disposed. The three.js docs say geometries, materials, and textures may be shared, so they must be disposed separately. Dispose each one yourself.",
  },
  {
    code: `// this texture came from GLTFLoader, and another model still draws it
texture.dispose();
texture.source.data.close(); // free the decoded ImageBitmap too`,
    ask: 'What happens the next time the other model is drawn?',
    choices: [
      "Its texture can't upload again, so it draws without it",
      'It uploads the texture again, the same as it does for geometry',
      'Nothing, since dispose kept a copy on the GPU',
    ],
    answer: 0,
    why: '`dispose()` alone would only cost a re-upload. But `close()` threw away the decoded image, so there is nothing left to upload: the model draws without its image, and WebGL logs a warning. Close an ImageBitmap only when nothing will draw its texture again.',
  },
];
