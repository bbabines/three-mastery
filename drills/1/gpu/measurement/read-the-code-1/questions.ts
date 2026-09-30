// Read-the-code questions for the measurement tools page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const t0 = performance.now();
renderer.render(scene, camera);
console.log(performance.now() - t0); // 2 ms`,
    ask: 'What do the 2 ms say about the GPU?',
    choices: [
      'The GPU took about 2 ms as well',
      "Nothing, since render() doesn't wait for it",
      'The GPU took less, starting earlier',
    ],
    answer: 1,
    why: "`render()` sends the commands and returns, so the 2 ms is the CPU's side. The GPU could take 2 ms or 20; time it with a GPU timer query or Chrome's Performance panel.",
  },
  {
    code: `// a composer: RenderPass, UnrealBloomPass, OutputPass
composer.render();
console.log(renderer.info.render.calls); // 1`,
    ask: 'Why does it log 1?',
    choices: [
      'The composer merges its draws into one',
      'info.render only counts draws to the canvas',
      'It resets on every render() call',
    ],
    answer: 2,
    why: "Every `render()` call clears `info.render`, and the composer's last one draws a single full-screen triangle. Set `autoReset = false` and call `info.reset()` once per frame.",
  },
  {
    code: `stats.begin();
renderer.render(scene, camera);
stats.end(); // the MS panel reads 3`,
    ask: 'What are the 3 milliseconds?',
    choices: [
      'CPU time between begin() and end()',
      "The GPU's time to draw the frame",
      'The whole frame, CPU and GPU together',
    ],
    answer: 0,
    why: '`Stats` reads `performance.now()` at `begin()` and `end()`, so its milliseconds are CPU time for what ran between them. It never sees the GPU.',
  },
  {
    code: `console.log(renderer.info.memory);
// { geometries: 48, textures: 12 }`,
    ask: 'What do the two numbers count?',
    choices: [
      'Megabytes of GPU memory in use',
      'Geometries and textures now on the GPU',
      'Objects created in JavaScript so far',
    ],
    answer: 1,
    why: 'three.js counts a geometry or texture when it uploads it and uncounts it on `dispose()`. A 4K texture and a tiny icon both count as 1.',
  },
];
