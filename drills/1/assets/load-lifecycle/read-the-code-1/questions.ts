// Read-the-code questions for the load lifecycle page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const gltf = await loader.loadAsync('/models/rack.glb');
scene.add(gltf.scene);
spinner.hidden = true; // "ready"`,
    ask: "When the spinner hides, what hasn't happened yet?",
    choices: [
      'The GPU upload and the shader compile',
      'Decoding the textures packed inside the .glb',
      'Nothing, since a resolved load is ready to draw',
    ],
    answer: 0,
    why: "The promise resolves once the objects are built in JavaScript memory, textures included. The GPU gets nothing until the first render that draws the model, which uploads its geometry and textures and compiles its shaders, and on a big model that frame can freeze. Hide the spinner after that render, or do the work early, as the decode, upload, compile page shows.",
  },
  {
    code: `// the server doesn't send the file's size
loader.load(url, onLoad, (event) => {
  bar.style.width = \`\${(100 * event.loaded) / event.total}%\`;
});`,
    ask: 'What does the progress bar do?',
    choices: [
      'It never moves: total is 0, so the width is Infinity%',
      'It fills normally: loaded grows toward the total',
      'It jumps to full: the first chunk counts as done',
    ],
    answer: 0,
    why: "Without a size from the server, `event.total` is 0 and `event.lengthComputable` is `false`. Dividing by 0 gives `Infinity`, and the browser ignores a width of `Infinity%`. Check `lengthComputable` and show a spinner when it's `false`.",
  },
  {
    code: `// "rakc" is a typo, so the file doesn't exist
loader.load('/models/rakc.glb', (gltf) => {
  scene.add(gltf.scene);
});`,
    ask: 'What does the user see?',
    choices: [
      'An empty scene, with the error only in the console',
      'An error message that three.js shows on the page for you',
      'A gray placeholder box where the model would go',
    ],
    answer: 0,
    why: "With no `onError`, GLTFLoader logs the error to the console and does nothing else, so the page just stays empty. Pass an `onError`, or use `loadAsync` in a `try`/`catch`, and show a message the user can see.",
  },
];
