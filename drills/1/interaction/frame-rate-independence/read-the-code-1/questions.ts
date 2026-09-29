// Read-the-code questions for the frame-rate-independent motion page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `renderer.setAnimationLoop(() => {
  turntable.rotation.y += 0.01;
  renderer.render(scene, camera);
});`,
    ask: 'How fast does it spin on a 120 Hz screen, next to a 60 Hz one?',
    choices: ['The same speed, but smoother', 'Half as fast, in smaller steps', 'Twice as fast'],
    answer: 2,
    why: 'The loop runs once per frame, so a 120 Hz screen adds 0.01 twice as often: 1.2 radians a second instead of 0.6. Think per second and scale by the frame\'s length: `turntable.rotation.y += 0.6 * delta`.',
  },
  {
    code: `// every frame
camera.position.lerp(goal, 0.1);`,
    ask: 'How does the glide differ on a 120 Hz screen?',
    choices: ['It closes the gap twice as fast', 'The same glide, just drawn more smoothly', 'It closes the gap half as fast'],
    answer: 0,
    why: 'Each frame closes a tenth of what is left, and a 120 Hz screen has twice as many frames a second, so the gap shrinks twice as fast: in a quarter of a second, about 96% closed instead of 79%. Use a fraction that depends on the frame\'s length: `1 - Math.exp(-8 * delta)`, or `MathUtils.damp` for a number.',
  },
  {
    code: `const t = 1 - Math.exp(-8 * delta);
camera.position.lerp(goal, t);`,
    ask: 'What changes between a 60 Hz and a 120 Hz screen?',
    choices: ['The 120 Hz glide finishes twice as fast', 'The 120 Hz glide finishes twice as slowly', 'The glide takes just as long, only smoother'],
    answer: 2,
    why: 'This is what `MathUtils.damp` does inside. Two short frames close the same share of the gap as one long frame, so the gap shrinks at the same rate per second at any frame rate; a faster screen only draws more in-between steps.',
  },
  {
    code: `x = MathUtils.damp(x, target, 0.1, delta);`,
    ask: 'How quickly does `x` close in on `target`?',
    choices: ['Slowly, under a tenth of the gap each second', 'A tenth of the remaining gap every frame, like lerp', 'It jumps straight to the target'],
    answer: 0,
    why: "`damp`'s third argument is a rate per second, lambda, not a per-frame fraction. At 0.1, a whole second closes only about 9.5% of the gap. Values around 5 to 15 feel responsive; bigger is snappier.",
  },
  {
    code: `const timer = new Timer(); // never connected to the document
renderer.setAnimationLoop((time) => {
  timer.update(time);
  ship.position.addScaledVector(velocity, timer.getDelta());
});`,
    ask: 'The user switches to another tab for a minute, then comes back. What does the ship do?',
    choices: ["It jumps a minute's worth in one frame", 'It carries on smoothly from where it stopped', 'It stops, since delta is capped'],
    answer: 0,
    why: "Browsers pause the loop in a hidden tab, so the first frame back has a delta of about 60 seconds, and the ship jumps a minute's travel at once. `timer.connect(document)` makes the timer start counting afresh when the page comes back. Nothing caps delta unless you do.",
  },
];
