// Read-the-code questions for the reuse and caching page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const a = await loader.loadAsync('/models/rack.glb');
const b = await loader.loadAsync('/models/rack.glb');
const shelfA = a.scene.getObjectByName('Shelf'); // a one-material Mesh
const shelfB = b.scene.getObjectByName('Shelf');
console.log(shelfA.geometry === shelfB.geometry);`,
    ask: 'What does it log?',
    choices: ['false: each load builds new geometry', 'true: GLTFLoader reuses it by URL', 'true: the browser cached the file'],
    answer: 0,
    why: "GLTFLoader doesn't remember earlier loads. Each one decodes the file and builds new geometries, materials, and textures, so the GPU ends up with two copies. Load once and use `a.scene.clone()` for the second rack.",
  },
  {
    code: `THREE.Cache.enabled = true;
const a = await loader.loadAsync('/models/rack.glb');
const b = await loader.loadAsync('/models/rack.glb');`,
    ask: 'What does the second load skip?',
    choices: [
      'Only the download: it still builds a full new copy',
      'Everything: it hands back the same model as a',
      'Nothing: Cache is only used for image files',
    ],
    answer: 0,
    why: '`THREE.Cache` keeps file data by URL, so the second load reads the bytes from memory instead of the network. It still decodes them and builds a complete new set of geometries, materials, and textures. Only loading once and cloning saves the memory.',
  },
  {
    code: `const loads = new Map();
const loadOnce = (url) => {
  if (!loads.has(url)) loads.set(url, loader.loadAsync(url));
  return loads.get(url);
};
const [a, b] = await Promise.all([loadOnce(url), loadOnce(url)]);`,
    ask: 'How many times is the file loaded and built?',
    choices: ['Once: b waits on the same promise as a', 'Twice: both calls start before either finishes', 'Once: b gets back an empty copy'],
    answer: 0,
    why: 'The first call stores the promise in the map straight away, before the load finishes. The second call finds it there and gets the same promise, so `a` and `b` are the same loaded result. Clone `a.scene` for each copy you place.',
  },
];
