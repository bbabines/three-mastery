// Read-the-code questions for the adaptive quality page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const isPhone = /Android|iPhone/.test(navigator.userAgent);
renderer.setPixelRatio(isPhone ? 1 : Math.min(devicePixelRatio, 2));
// set once, at startup`,
    ask: 'What does this approach miss?',
    choices: [
      'Any slowdown after startup, like a hot phone or a heavy view',
      'Nothing, since the device type decides how fast it runs',
      'Only tablets, since they match neither of the tests',
    ],
    answer: 0,
    why: "The same device runs at different speeds during a session: a phone slows its chips as it heats up, a laptop may save power on battery, and some views are far heavier than others. A setting chosen once can't respond to any of it; watching frame times as the app runs can. (A fast new phone also ends up blurrier than it needs to be.)",
  },
  {
    code: `// checked every frame; at ratio 2 frames take 22 ms, at ratio 1 they take 12
if (frameMs > budget) renderer.setPixelRatio(1);
else renderer.setPixelRatio(2);`,
    ask: 'What does the viewer see on a 60 Hz screen?',
    choices: [
      'A steady picture at ratio 1, since 12 ms fits the budget',
      'A steady picture at ratio 2, since it starts out there',
      'Sharpness flipping back and forth every frame or two',
    ],
    answer: 2,
    why: "At 2 the frame is late, so the ratio drops to 1; at 1 it's on time, so the ratio goes straight back to 2, and so on, resizing the canvas each time. Hysteresis fixes it: step down after a run of late frames, step up only after a much longer run on time, and wait longer after each step up that doesn't hold.",
  },
  {
    code: `const start = performance.now();
renderer.render(scene, camera);
const frameMs = performance.now() - start; // used to pick the quality`,
    ask: 'Why can this pick the wrong quality in a scene heavy on pixel work?',
    choices: [
      "It can't, since render() returns once the frame is drawn",
      "It times the CPU's side only, not the GPU drawing it",
      'performance.now() is too coarse to time one frame',
    ],
    answer: 1,
    why: "`render()` returns once the commands are sent, and the GPU draws them afterwards (the measurement tools page). A scene held up by pixel work shows a small number here while its frames arrive late. Use the time between frames, from a Timer: when the GPU is the slow side, that's where it shows.",
  },
];
