// Read-the-code questions for the rotating around a point page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `planet.position.set(4, 0, 0);
moon.position.set(5, 0, 0); // both straight in the scene
moon.position.applyAxisAngle(new Vector3(0, 1, 0), Math.PI);`,
    ask: 'Where does the moon end up?',
    choices: [
      '(3, 0, 0): swung halfway around the planet',
      '(−5, 0, 0): swung around the center of the world',
      '(5, 0, 0): turned in place, without moving',
    ],
    answer: 1,
    why: "`applyAxisAngle` turns a vector around (0, 0, 0) of its own space, and the moon's position is measured from the scene, so it swings around the world's center and ends up 9 units from the planet. To swing around the planet, turn the offset from the planet and add the planet back.",
  },
  {
    code: `// planet at (4, 0, 0), moon starting at (5, 0, 0)
const offset = moon.position.clone().sub(planet.position);
offset.applyAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);
moon.position.copy(planet.position).add(offset);`,
    ask: 'Where does the moon end up?',
    choices: ['(0, 0, −5)', '(4, 0, −1)', '(5, 0, 0)'],
    answer: 1,
    why: "The offset from the planet is (1, 0, 0). A quarter turn around Y swings it to (0, 0, −1), and adding the planet back gives (4, 0, −1): a quarter circle around the planet, still 1 away. (0, 0, −5) is where a quarter turn around the world's center would put it.",
  },
  {
    code: `// the chair sits straight in the scene
const center = new Box3().setFromObject(chair).getCenter(new Vector3());
chair.position.sub(center).applyAxisAngle(up, angle).add(center);
chair.rotateOnWorldAxis(up, angle);`,
    ask: 'What does the chair do?',
    choices: [
      'Swings around the world origin, then spins',
      'Turns by `angle` around its own middle, which stays put',
      'Spins around its origin, then drifts off',
    ],
    answer: 1,
    why: "`sub` makes `position` the offset from the middle, `applyAxisAngle` turns it, and `add` puts the middle back, all on `position` itself. `rotateOnWorldAxis` turns the chair by the same amount, so its middle stays exactly where it was. The `Box3` center is in the world, which matches `position` only because the chair sits straight in the scene.",
  },
];
