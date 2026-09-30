// Read-the-code questions for the frame-rate-independent motion page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// on a 120 Hz screen, next to a 60 Hz one
renderer.setAnimationLoop(() => {
  turntable.rotation.y += 0.01;
  renderer.render(scene, camera);
});`,
    ask: 'How fast does it spin?',
    choices: ['The same speed, but smoother', 'Half as fast, in smaller steps', 'Twice as fast, with twice the steps'],
    answer: 2,
    why: "The loop runs once per frame, so 120 Hz adds 0.01 twice as often. Think per second and scale by the frame's length: `+= 0.6 * delta`.",
  },
  {
    code: `// every frame
camera.position.lerp(goal, 0.1);`,
    ask: 'How does the glide differ on a 120 Hz screen?',
    choices: ['It closes the gap twice as fast', 'The same glide, just drawn more smoothly', 'It closes the gap half as fast'],
    answer: 0,
    why: "Each frame closes a tenth of what's left, and 120 Hz has twice the frames. Use a fraction from the frame's length, like `1 - Math.exp(-8 * delta)`.",
  },
  {
    code: `const t = 1 - Math.exp(-8 * delta);
camera.position.lerp(goal, t);`,
    ask: 'What changes between a 60 Hz and a 120 Hz screen?',
    choices: ['The 120 Hz glide finishes twice as fast', 'The 120 Hz glide finishes twice as slowly', 'The glide takes just as long, only smoother'],
    answer: 2,
    why: 'This is what `MathUtils.damp` does inside. Two short frames close the same share of the gap as one long frame, so a faster screen only adds in-between steps.',
  },
  {
    code: `x = MathUtils.damp(x, target, 0.1, delta);`,
    ask: 'How quickly does `x` close in on `target`?',
    choices: ['Slowly, under a tenth of the gap each second', "A tenth of what's left every frame, like lerp", 'It jumps straight to the target'],
    answer: 0,
    why: "`damp`'s third argument is a rate per second, not a per-frame fraction. At 0.1, a whole second closes under a tenth of the gap; try 5 to 15.",
  },
  {
    code: `// the user leaves the tab for a minute, then comes back
const timer = new Timer(); // never connected to the document
renderer.setAnimationLoop((time) => {
  ship.position.addScaledVector(velocity, timer.update(time).getDelta());
});`,
    ask: 'What does the ship do?',
    choices: ["It jumps a minute's worth in one frame", 'It carries on smoothly from where it stopped', 'It stops, since delta is capped'],
    answer: 0,
    why: 'Browsers pause the loop in a hidden tab, so the first frame back has a delta of about 60 seconds. `timer.connect(document)` restarts the count when the page returns.',
  },
];
