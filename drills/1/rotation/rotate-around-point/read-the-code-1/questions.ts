// Read-the-code questions for the rotating around a point page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `planet.position.set(4, 0, 0);
moon.position.set(5, 0, 0); // both straight in the scene
moon.position.applyAxisAngle(new Vector3(0, 1, 0), Math.PI);`,
    ask: 'Where does the moon end up?',
    choices: ['(3, 0, 0), halfway around the planet', '(−5, 0, 0), around the world center', '(5, 0, 0), turned in place'],
    answer: 1,
    why: "`applyAxisAngle` turns around (0, 0, 0) of the position's space, here the world's center. Turn the offset from the planet instead, then add the planet back.",
  },
  {
    code: `// planet at (4, 0, 0), moon starting at (5, 0, 0)
const offset = moon.position.clone().sub(planet.position);
offset.applyAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);
moon.position.copy(planet.position).add(offset);`,
    ask: 'Where does the moon end up?',
    choices: ['(0, 0, −5)', '(4, 0, −1)', '(5, 0, 0)'],
    answer: 1,
    why: "The offset (1, 0, 0) turns to (0, 0, −1), and adding the planet back gives (4, 0, −1), still 1 away. (0, 0, −5) is a turn around the world's center.",
  },
  {
    code: `// the chair sits straight in the scene
const center = new Box3().setFromObject(chair).getCenter(new Vector3());
chair.position.sub(center).applyAxisAngle(up, angle).add(center);
chair.rotateOnWorldAxis(up, angle);`,
    ask: 'What does the chair do?',
    choices: ['Swings around the world origin', 'Turns in place around its middle', 'Spins, then drifts off its spot'],
    answer: 1,
    why: 'The first line turns the offset from the middle, and `rotateOnWorldAxis` turns the chair to match, so its middle stays put. Inside a group, convert the center first.',
  },
];
