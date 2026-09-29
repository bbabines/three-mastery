// Read-the-code questions for the leak detection page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// logged after each variant swap in a kiosk's product configurator
console.log(renderer.info.memory.textures);
// 41, 42, 43, 44, … one more after every swap`,
    ask: 'Is this a problem?',
    choices: [
      'Yes, a leak that adds up over a day of swaps',
      'No, since one texture a swap is too small to matter',
      'No, since three.js frees unused textures by itself',
    ],
    answer: 0,
    why: "Every swap should end where the last one did. One more texture each time is one never disposed, and a thousand swaps in a kiosk's day leave a thousand behind, 5.6 GB at 1024 × 1024; the WebGL context is lost or the tab reloads well before that. three.js never frees a texture on its own, so find the one the unload code misses.",
  },
  {
    code: `const before = renderer.info.memory.geometries; // 12
openProductPage();
closeProductPage(); // no frame was rendered in between
console.log(renderer.info.memory.geometries);    // 12`,
    ask: 'What does the matching 12 prove?',
    choices: [
      'That the page frees everything it creates',
      'That the page leaks nothing, on the GPU or in JavaScript',
      'Nothing yet, since nothing was drawn and uploaded',
    ],
    answer: 2,
    why: "`renderer.info.memory` counts what's been uploaded, and uploads happen on the first frame that draws something. With no frame in between, the page's models never reached the GPU, so the count couldn't have moved. Let frames render in each cycle, and run several cycles.",
  },
  {
    code: `function unload(variant) {
  scene.remove(variant);
  variant.traverse((o) => {
    if (!o.isMesh) return;
    o.geometry.dispose();
    o.material.map?.dispose();
    o.material.dispose();
  });
}`,
    ask: 'The variants use a color map and a normal map. What stays on the GPU after each unload?',
    choices: [
      'Nothing, since material.dispose() frees its textures',
      'Each normalMap, since only the map is disposed',
      'The materials, since they were disposed last',
    ],
    answer: 1,
    why: "`material.dispose()` frees the material's shader program, not its textures, and this code disposes only `map`. Every `normalMap` stays behind: a slow leak, one per part per cycle. Dispose every texture the material holds: `Object.values(material).filter((v) => v?.isTexture)`, as on the disposal ownership page.",
  },
  {
    code: `function swap(next) {
  undoStack.push(current);  // keep the old variant, for undo
  scene.remove(current);
  disposeModel(current);    // geometries, materials, and textures
  current = next;
  scene.add(next);
}`,
    ask: 'After 500 swaps, `renderer.info.memory` is back where it started. Is memory clean?',
    choices: [
      'No, the old variants still hold their arrays in JavaScript',
      'Yes, since the GPU counts came back to where they started',
      'Yes, since disposed objects are removed from memory',
    ],
    answer: 0,
    why: "`dispose()` frees the GPU copies only. The geometry arrays and images stay in JavaScript for as long as something refers to them, and the undo stack refers to all 500. `renderer.info` can't see that; two heap snapshots in Chrome's Memory panel, compared, show the Meshes piling up. Keep only what undo needs, like the variant's name.",
  },
];
