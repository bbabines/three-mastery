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
    choices: ['true, since GLTFLoader reuses it by URL', 'false, since each load builds new geometry', 'true, since the browser cached the file'],
    answer: 1,
    why: "GLTFLoader doesn't remember earlier loads, so each one builds new geometries, materials, and textures. Load once and use `a.scene.clone()` for the second rack.",
  },
  {
    code: `THREE.Cache.enabled = true;
const a = await loader.loadAsync('/models/rack.glb');
const b = await loader.loadAsync('/models/rack.glb');`,
    ask: 'What does the second load skip?',
    choices: ['Everything, returning the same model', 'Only the download, not the rebuild', 'Nothing, since Cache only holds images'],
    answer: 1,
    why: '`THREE.Cache` keeps the file\'s bytes, so the download is skipped, but the file is still decoded into a full new set of resources. Only cloning saves the memory.',
  },
  {
    code: `const loadOnce = (url) => { // loads: a Map, empty at first
  if (!loads.has(url)) loads.set(url, loader.loadAsync(url));
  return loads.get(url);
};
const [a, b] = await Promise.all([loadOnce(url), loadOnce(url)]);`,
    ask: 'How many times is the file loaded?',
    choices: ['Once, since b gets the same promise', 'Twice, since both start before either ends', 'Once, but b gets an empty copy'],
    answer: 0,
    why: 'The first call stores the promise straight away, so the second call finds it and gets the same one. Clone `a.scene` for each copy you place.',
  },
];
