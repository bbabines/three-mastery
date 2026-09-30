// Read-the-code questions for the leak detection page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// logged after each variant swap in a kiosk
console.log(renderer.info.memory.textures);
// 41, 42, 43, 44, … one more after every swap`,
    ask: 'Is this a problem?',
    choices: [
      'Yes, since it adds up over a day of swaps',
      'No, since one texture a swap is too small',
      'No, since three.js frees old textures itself',
    ],
    answer: 0,
    why: 'Every swap should end where the last one did. A thousand swaps leave a thousand textures behind, and three.js never frees one on its own, so find the one the unload code misses.',
  },
  {
    code: `const before = renderer.info.memory.geometries; // 12
openProductPage();
closeProductPage(); // no frame was rendered in between
console.log(renderer.info.memory.geometries);    // 12`,
    ask: 'What does the matching 12 prove?',
    choices: [
      'That the page frees everything it creates',
      'That nothing leaks, on the GPU or in JavaScript',
      'Nothing yet, since nothing was uploaded',
    ],
    answer: 2,
    why: "Uploads happen on the first frame that draws something, and no frame ran, so the count couldn't move. Let frames render in each cycle, and run several cycles.",
  },
  {
    code: `function disposePart(part) { // its material has a map and a normalMap
  part.geometry.dispose();
  part.material.map?.dispose();
  part.material.dispose();
}`,
    ask: 'What stays on the GPU after each unload?',
    choices: [
      'Nothing, since material.dispose() frees textures',
      'Each normalMap, since only map is disposed',
      'The materials, since they were disposed last',
    ],
    answer: 1,
    why: "`material.dispose()` doesn't dispose its textures, and this code disposes only `map`, so every `normalMap` stays: a slow leak. Dispose every texture the material holds.",
  },
  {
    code: `// on every swap; after 500 swaps, renderer.info.memory is back where it started
undoStack.push(current); // keep the old variant, for undo
scene.remove(current);
disposeModel(current);   // geometries, materials, and textures`,
    ask: 'Is memory clean after 500 swaps?',
    choices: [
      'No, the old variants still hold their arrays',
      'Yes, since the GPU counts came back',
      'Yes, since disposed objects leave memory',
    ],
    answer: 0,
    why: '`dispose()` frees the GPU copies only. The arrays and images stay in JavaScript while the undo stack refers to them. Compare two heap snapshots to see the Meshes pile up.',
  },
];
