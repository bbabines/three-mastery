// Read-the-code questions for the slerp page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const a = MathUtils.degToRad(170);
const b = MathUtils.degToRad(-170);
ship.rotation.y = MathUtils.lerp(a, b, t); // t goes from 0 to 1`,
    ask: 'How far does the ship turn in all?',
    choices: ['20°, the short way across 180°', '340°, the long way through 0°', '0°, since the two headings wrap'],
    answer: 1,
    why: 'Lerp blends the numbers, which run from 170 down through 0 to −170: a 340° swing. Slerp the two quaternions to take the 20° short way.',
  },
  {
    code: `const a = new Quaternion(); // no turn
const b = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), MathUtils.degToRad(120));
const q = a.clone().slerp(b, 0.25);`,
    ask: 'How far is `q` turned from `a`?',
    choices: ['30°', 'Less than 30°, as slerp eases in', '90°, the long way round'],
    answer: 0,
    why: 'Slerp turns at an even speed, so a quarter of `t` is a quarter of the 120°. For easing, pass an eased `t`, like `MathUtils.smoothstep(t, 0, 1)`.',
  },
  {
    code: `// every frame, where delta is seconds since the last frame:
turret.quaternion.rotateTowards(goal, 2 * delta);`,
    ask: 'What does the turret do?',
    choices: ["Covers 2% of what's left, slowing down", 'Turns up to 2 radians a second, stopping on goal', 'Snaps to goal after 2 seconds'],
    answer: 1,
    why: "`rotateTowards` turns by at most the angle given, the short way, and never overshoots. `slerp(goal, 0.1)` instead covers a tenth of what's left, so it slows down.",
  },
];
