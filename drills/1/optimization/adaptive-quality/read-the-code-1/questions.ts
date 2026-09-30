// Read-the-code questions for the adaptive quality page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const isPhone = /Android|iPhone/.test(navigator.userAgent);
renderer.setPixelRatio(isPhone ? 1 : Math.min(devicePixelRatio, 2));
// set once, at startup`,
    ask: 'What does this approach miss?',
    choices: [
      'Slowdowns later, like a hot phone',
      'Nothing, since the device type sets its speed',
      'Only tablets, which match neither test',
    ],
    answer: 0,
    why: 'The same device runs at different speeds during a session: a phone slows as it heats up, and some views are heavier. Watching frame times as the app runs catches it.',
  },
  {
    code: `// checked every frame on a 60 Hz screen; frames take 22 ms at ratio 2, 12 ms at ratio 1
if (frameMs > budget) renderer.setPixelRatio(1);
else renderer.setPixelRatio(2);`,
    ask: 'What does the viewer see?',
    choices: ['A steady picture at ratio 1', 'A steady picture at ratio 2', 'Sharpness flipping every frame or two'],
    answer: 2,
    why: "At 2 the frame is late, so the ratio drops to 1; at 1 it's on time, so it goes straight back. Hysteresis fixes it: step down quickly, and step up only after a long run on time.",
  },
  {
    code: `// in a scene held up by pixel work
const start = performance.now();
renderer.render(scene, camera);
const frameMs = performance.now() - start; // used to pick the quality`,
    ask: 'Why can this pick the wrong quality?',
    choices: [
      "It can't, since render() waits for the GPU",
      "It times only the CPU's side of the frame",
      'performance.now() is too coarse for a frame',
    ],
    answer: 1,
    why: '`render()` returns once the commands are sent, and the GPU draws them afterwards, so pixel work barely shows here. Use the time between frames instead.',
  },
];
