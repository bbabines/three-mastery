// Read-the-code questions for the measurement tools page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const t0 = performance.now();
renderer.render(scene, camera);
console.log(performance.now() - t0); // 2 ms`,
    ask: "What do the 2 ms say about the GPU's share of the frame?",
    choices: [
      'The GPU took about 2 ms as well',
      'Nothing, since render() returns once the work is sent',
      'The GPU took less, since it started earlier',
    ],
    answer: 1,
    why: '`render()` sends WebGL commands and returns; the GPU carries them out afterwards. The 2 ms is the CPU\'s side: three.js\'s JavaScript and handing the commands over. The GPU could take 2 ms or 20. Its time needs a GPU timer query or Chrome\'s Performance panel.',
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
    why: 'Every `renderer.render()` call clears `info.render` first, and the composer calls it many times: the last one is OutputPass drawing a single full-screen triangle. Set `renderer.info.autoReset = false` and call `renderer.info.reset()` once at the start of each frame to count them all.',
  },
  {
    code: `stats.begin();
renderer.render(scene, camera);
stats.end(); // the MS panel reads 3`,
    ask: 'What are the 3 milliseconds?',
    choices: [
      'CPU time between begin() and end()',
      "The GPU's time to draw the frame",
      'The whole frame, CPU and GPU added up',
    ],
    answer: 0,
    why: '`Stats` reads `performance.now()` at `begin()` and `end()`, so its milliseconds are CPU time for whatever ran between them: here, preparing and sending the frame. Its FPS panel counts frames, which stop at the refresh rate. Neither sees the GPU.',
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
    why: 'three.js counts a geometry or texture when it first uploads it and uncounts it on `dispose()`. They are counts, not bytes: one 4K texture and one 64-pixel icon both count as 1. A count that keeps climbing as the user browses products is a leak, which the leak detection page covers.',
  },
];
