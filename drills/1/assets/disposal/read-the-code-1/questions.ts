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
      "Garbage collection hasn't run yet",
      'remove leaves the GPU copies in place',
      'renderer.info counts every geometry ever made',
    ],
    answer: 1,
    why: 'Removing a model only stops it being drawn. Its resources stay on the GPU until you `dispose()` each one, so dispose the old variant after removing it.',
  },
  {
    code: `// mesh.material.map is a 2048 × 2048 texture
scene.remove(mesh);
mesh.geometry.dispose();
mesh.material.dispose();`,
    ask: "What's still on the GPU?",
    choices: [
      'The texture, which material.dispose() leaves',
      'Nothing, since materials free their maps',
      'The geometry, until the next render',
    ],
    answer: 0,
    why: "`material.dispose()` frees its shader program, not the textures it points to, which others might share. Call `mesh.material.map.dispose()` too.",
  },
  {
    code: `const copyB = copyA.clone(); // both racks on screen
scene.remove(copyA);
copyA.traverse((object) => {
  if (object.isMesh) { object.geometry.dispose(); object.material.dispose(); }
});`,
    ask: 'What happens to copyB on the next frame?',
    choices: [
      'It vanishes, since its geometry is gone',
      'Nothing changes, since it has its own',
      'It draws, after uploading it all again',
    ],
    answer: 2,
    why: "copyB shares copyA's geometries and materials, so the next render uploads and compiles them again, a stall for nothing. Dispose only what nothing else uses.",
  },
  {
    code: `scene.remove(rack);
rack.dispose(); // every Object3D has a dispose() method`,
    ask: 'What does `rack.dispose()` free?',
    choices: [
      "Only its own mesh's geometry",
      'None of its geometry, materials, or textures',
      'Everything it and its children use',
    ],
    answer: 1,
    why: '`Object3D.dispose()` only announces that the object is going away. Its geometries, materials, and textures may be shared, so dispose each one yourself.',
  },
  {
    code: `// this texture came from GLTFLoader, and another model still draws it
texture.dispose();
texture.source.data.close(); // free the decoded image too`,
    ask: 'What happens when the other model draws next?',
    choices: [
      'It uploads the texture again, as before',
      "It draws without the texture's image",
      'Nothing, since dispose kept a GPU copy',
    ],
    answer: 1,
    why: "`dispose()` alone would only cost a re-upload, but `close()` threw the decoded image away, so there's nothing to upload. Close it only when nothing will draw it again.",
  },
];
