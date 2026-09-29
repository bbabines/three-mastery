// Read-the-code questions for the preload vs lazy load page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// a catalog of 200 products; the page shows one at a time
await Promise.all(productUrls.map((url) => loader.loadAsync(url)));
showProduct(0);`,
    ask: 'What does loading everything up front cost?',
    choices: [
      'A long wait for the first product, and memory for all 200',
      'Nothing, since every switch after that is instant',
      'Only download time, since models use no memory until drawn',
    ],
    answer: 0,
    why: "Nothing shows until all 200 have downloaded and decoded, and every one then sits in memory, whether or not the shopper ever looks at it. Load the first product, show it, preload the likely next few, and lazy-load the rest.",
  },
  {
    code: `colorButton.onclick = async () => {
  const gltf = await loader.loadAsync(url); // the first click on this color
  swapModel(gltf.scene);
};`,
    ask: 'What does the shopper see right after the first click?',
    choices: [
      'The old model, until the new one downloads and decodes',
      'The new model straight away, since the click started it',
      'A blank scene, until the new model is ready',
    ],
    answer: 0,
    why: '`swapModel` runs only after the `await`, so the old model stays on screen while the new one downloads and decodes, and the frame that first draws it still uploads and compiles. That wait is the price of lazy loading; preload the likeliest colors to avoid it.',
  },
  {
    code: `const first = await load('/models/rack-black.glb');
scene.add(first.scene);
load('/models/rack-white.glb'); // no await`,
    ask: 'What does the last line do?',
    choices: [
      'Starts the white rack loading while the black one is shown',
      'Nothing, because the promise is never awaited',
      'Waits for the white rack before anything draws',
    ],
    answer: 0,
    why: "A load starts as soon as `loadAsync` is called; `await` only waits for it. With no `await`, the white rack loads in the background while the black one is already on screen, so a later switch to white is instant. With the load-once map from the reuse and caching page, that later `load` call returns the same promise.",
  },
];
