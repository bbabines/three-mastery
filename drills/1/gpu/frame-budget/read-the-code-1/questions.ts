// Read-the-code questions for the frame budget page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
  fpsCounter.update(); // a steady 60 on a 60 Hz monitor
});`,
    ask: 'How much of the 16.67 ms budget is left?',
    choices: [
      "None, since 60 FPS means it's all used",
      'Most of it, since 60 FPS means no strain',
      'Unknown, since FPS stops at the refresh rate',
    ],
    answer: 2,
    why: 'On a 60 Hz screen, FPS stops at 60 whether a frame takes 3 ms or 16 ms. To see what is left, measure frame time in milliseconds.',
  },
  {
    code: `// per frame: CPU work 6 ms (app code, draw calls),
//            GPU work 14 ms (mostly pixels)
renderer.render(scene, camera);`,
    ask: 'About how long does each frame take?',
    choices: [
      '20 ms, since the CPU and GPU take turns',
      '14 ms, since the slower side sets the pace',
      '6 ms, since render() returns early',
    ],
    answer: 1,
    why: 'The CPU usually prepares the next frame while the GPU draws this one, so frames come at the slower side\'s pace. `render()` returning says nothing about when the GPU finishes.',
  },
  {
    code: `// per frame: CPU 5 ms, GPU 15 ms (fragment work at pixel ratio 2)
const merged = mergeGeometries(partGeometries); // CPU work drops to 2 ms
scene.add(new Mesh(merged, sharedMaterial));`,
    ask: 'What happens to the frame time?',
    choices: [
      'Almost nothing, since the GPU still takes 15 ms',
      'It drops by 3 ms, from 20 ms to 17 ms',
      'It drops a lot, since draw calls were the problem',
    ],
    answer: 0,
    why: 'The frame was waiting on the GPU, so cutting CPU time leaves it at about 15 ms. Fix the slower side, here the pixel work, for example by lowering the pixel ratio.',
  },
  {
    code: `// the same viewer, 12 ms of work per frame,
// moved from a 60 Hz monitor to a 120 Hz laptop screen
renderer.setAnimationLoop(animate);`,
    ask: 'How does it run on the 120 Hz screen?',
    choices: [
      'It misses the 8.33 ms budget and skips refreshes',
      'At 120 FPS, since the work is the same',
      'Worse than at 60 Hz, since 12 ms is too long',
    ],
    answer: 0,
    why: "12 ms doesn't fit the 8.33 ms between refreshes, so frames miss some and the counter reads below 120. Each frame still takes 12 ms, so it's no worse than before.",
  },
];
