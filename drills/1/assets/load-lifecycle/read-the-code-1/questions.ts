// Read-the-code questions for the load lifecycle page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const gltf = await loader.loadAsync('/models/rack.glb');
scene.add(gltf.scene);
spinner.hidden = true; // "ready"`,
    ask: 'When the spinner hides, what is still to do?',
    choices: [
      'Decoding the textures inside the .glb',
      'Nothing, since the load has resolved',
      'The GPU upload and the shader compile',
    ],
    answer: 2,
    why: 'The promise resolves once the objects exist in JavaScript memory. The first render uploads them and compiles shaders, which can freeze a frame, so hide the spinner after it.',
  },
  {
    code: `// the server doesn't send the file's size
loader.load(url, onLoad, (event) => {
  bar.style.width = \`\${(100 * event.loaded) / event.total}%\`;
});`,
    ask: 'What does the progress bar do?',
    choices: [
      'It fills as loaded grows toward the total',
      'It never moves, since the width is Infinity%',
      'It jumps to full on the first chunk',
    ],
    answer: 1,
    why: "Without a size, `event.total` is 0, so the width is `Infinity%`, which the browser ignores. Check `event.lengthComputable` and show a spinner when it's `false`.",
  },
  {
    code: `// "rakc" is a typo, so the file doesn't exist
loader.load('/models/rakc.glb', (gltf) => {
  scene.add(gltf.scene);
});`,
    ask: 'What does the user see?',
    choices: [
      'An empty scene, with the error in the console',
      'An error message three.js puts on the page',
      'A gray placeholder box where the model goes',
    ],
    answer: 0,
    why: 'With no `onError`, GLTFLoader only logs the error, so the page stays empty. Pass an `onError`, or catch the `loadAsync` rejection, and show a message.',
  },
];
