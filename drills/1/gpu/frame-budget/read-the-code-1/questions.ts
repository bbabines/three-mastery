// Read-the-code questions for the frame budget page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
  fpsCounter.update(); // a steady 60 on a 60 Hz monitor
});`,
    ask: 'How much of the 16.67 ms frame budget is left over?',
    choices: [
      "None: 60 FPS means it's all in use",
      "Most of it: 60 FPS means there's no strain",
      "Unknown: FPS can't go past the refresh rate",
    ],
    answer: 2,
    why: 'The loop runs once per refresh, so on a 60 Hz screen FPS stops at 60 whether a frame takes 3 ms or 16 ms. A steady 60 only says the budget was met. To see how much is left, look at frame time in milliseconds, which the measurement tools page covers.',
  },
  {
    code: `// per frame: CPU work 6 ms (app code, draw calls),
//            GPU work 14 ms (mostly pixels)
renderer.render(scene, camera);`,
    ask: 'About how long does each frame take?',
    choices: [
      '20 ms: the CPU and the GPU take turns',
      '14 ms: the slower side sets the pace',
      '6 ms: render() returns after the CPU part',
    ],
    answer: 1,
    why: 'The CPU prepares the next frame while the GPU draws this one, so as a rule of thumb frames come out at the pace of the slower side: here the GPU, at 14 ms, inside a 60 Hz budget of 16.67 ms. They\'d add up only if they took turns. And `render()` returning quickly says nothing about when the GPU finishes.',
  },
  {
    code: `// per frame: CPU 5 ms, GPU 15 ms (fragment work at pixel ratio 2)
const merged = mergeGeometries(partGeometries); // CPU work drops to 2 ms
scene.add(new Mesh(merged, sharedMaterial));`,
    ask: 'What happens to the frame time?',
    choices: [
      'Almost nothing: the GPU still takes 15 ms',
      'By 3 ms: from 20 ms down to 17 ms',
      'It drops a lot: draw calls were the problem',
    ],
    answer: 0,
    why: 'The frame was waiting on the GPU. Cutting CPU time from 5 ms to 2 ms leaves the slower side at 15 ms, so the frame time barely moves. Fix the side that\'s slower, here the pixel work, for example by lowering the pixel ratio. Loop 3\'s proof experiments find which side that is.',
  },
  {
    code: `// the same viewer, 12 ms of work per frame,
// moved from a 60 Hz monitor to a 120 Hz laptop screen
renderer.setAnimationLoop(animate);`,
    ask: 'How does it run on the 120 Hz screen?',
    choices: [
      'It misses the 8.33 ms budget and skips refreshes',
      'At 120 FPS, since the work per frame is the same',
      'Worse than at 60 Hz, since 12 ms is too long there',
    ],
    answer: 0,
    why: 'At 120 Hz each refresh leaves 8.33 ms, and 12 ms of work doesn\'t fit, so frames miss refreshes and the counter reads below 120. It isn\'t worse than before: each frame still takes 12 ms and fits the old 16.67 ms rhythm. Faster screens halve the budget, so targets need setting per screen.',
  },
];
