// Read-the-code questions for the slerp page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const a = MathUtils.degToRad(170);
const b = MathUtils.degToRad(-170);
ship.rotation.y = MathUtils.lerp(a, b, t); // t goes from 0 to 1`,
    ask: 'How far does the ship turn as `t` goes from 0 to 1?',
    choices: [
      '20°, the short way round, across 180°',
      '340°, the long way round, passing through 0°',
      '0°, since −170° and 170° wrap to the same',
    ],
    answer: 1,
    why: 'Lerp blends the numbers, and the numbers run from 170 down through 0 to −170, so the ship swings 340° the long way. The two headings are only 20° apart, across 180°. Slerp between the two quaternions takes that short way: `ship.quaternion.slerpQuaternions(qa, qb, t)`.',
  },
  {
    code: `const a = new Quaternion(); // no turn
const b = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), MathUtils.degToRad(120));
const q = a.clone().slerp(b, 0.25);`,
    ask: 'How far is `q` turned from `a`?',
    choices: ['30°', 'Less than 30°, since slerp eases in', '90°, since slerp goes the long way'],
    answer: 0,
    why: "Slerp turns at an even speed, so a quarter of `t` is a quarter of the turn: 30° of the 120°. It doesn't ease in or out by itself; for that, pass an eased `t` such as `MathUtils.smoothstep(t, 0, 1)`. And it always takes the short way round.",
  },
  {
    code: `// every frame, where delta is seconds since the last frame:
turret.quaternion.rotateTowards(goal, 2 * delta);`,
    ask: 'What does the turret do?',
    choices: [
      'Moves 2% of the remaining turn each frame, slowing near goal',
      'Turns toward goal at up to 2 radians a second, and stops exactly on it',
      'Snaps straight to goal once 2 seconds have passed',
    ],
    answer: 1,
    why: "`rotateTowards` turns by at most the angle you give it, here 2 radians for each second of `delta`, along the short way, and never overshoots. That's a steady turning speed. The other common pattern, `slerp(goal, 0.1)` every frame, covers a tenth of what's left each time, so it slows as it arrives.",
  },
];
