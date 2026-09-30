// Read-the-code questions for the preload vs lazy load page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// a catalog of 200 products; the page shows one at a time
await Promise.all(productUrls.map((url) => loader.loadAsync(url)));
showProduct(0);`,
    ask: 'What does loading everything up front cost?',
    choices: [
      'Nothing, since every switch is then instant',
      'A long first wait, and memory for all 200',
      'Only download time, not any memory',
    ],
    answer: 1,
    why: "Nothing shows until all 200 have loaded, and each holds its memory whether it's viewed or not. Show the first, preload the likely next few, and lazy-load the rest.",
  },
  {
    code: `colorButton.onclick = async () => {
  const gltf = await loader.loadAsync(url); // the first click on this color
  swapModel(gltf.scene);
};`,
    ask: 'What does the shopper see right after clicking?',
    choices: ['The new model, straight away', 'A blank scene, until the new one loads', 'The old model, until the new one loads'],
    answer: 2,
    why: '`swapModel` runs only after the `await`, so the old model stays up during the download and decode. That wait is the cost of lazy loading; preload the likeliest colors.',
  },
  {
    code: `const first = await load('/models/rack-black.glb');
scene.add(first.scene);
load('/models/rack-white.glb'); // no await`,
    ask: 'What does the last line do?',
    choices: [
      'Starts loading the white rack in the background',
      'Nothing, since the promise is never awaited',
      'Blocks drawing until the white rack loads',
    ],
    answer: 0,
    why: 'A load starts when `loadAsync` is called, and `await` only waits for it. The white rack loads while the black one is on screen, so switching later is instant.',
  },
];
