// Read-the-code questions for the points vs directions lesson. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `drone.position.set(0, 5, 0); // it climbs, without turning
drone.updateMatrixWorld();
const nose = new Vector3(0, 0, 1).transformDirection(drone.matrixWorld);`,
    ask: 'What does `nose` hold?',
    choices: [
      '(0, 0, 1): moving never changes a direction',
      '(0, 5, 1): the climb gets added to it',
      '(0, 1, 0): it points the way the drone moved',
    ],
    answer: 0,
    why: "Moving an object shifts the places on it, not its directions. `transformDirection` leaves out the move, so the nose points the same way wherever the drone flies. (0, 5, 1) is what `applyMatrix4` would give: it treats the vector as a place and adds the move.",
  },
  {
    code: `tank.scale.setScalar(3); // at the origin, unturned, three times normal size
tank.updateMatrixWorld();
const valve = new Vector3(0, 1, 0).applyMatrix4(tank.matrixWorld);
const spout = new Vector3(0, 1, 0).transformDirection(tank.matrixWorld);`,
    ask: 'What are `valve` and `spout`?',
    choices: ['(0, 3, 0) and (0, 1, 0)', '(0, 3, 0) and (0, 3, 0)', '(0, 1, 0) and (0, 1, 0)'],
    answer: 0,
    why: '`valve` is a place, so it moves out with the tank as it grows: 1 up becomes 3 up. `spout` is a direction. `transformDirection` stretches it too, then sets its length back to 1, so only the way it points is left.',
  },
  {
    code: `// the scanner stands at (6, 1, 0) and isn't turned
scanner.updateMatrixWorld();
const ahead = new Vector3(0, 0, -1).applyMatrix4(scanner.matrixWorld);
raycaster.set(scannerTip, ahead.normalize());`,
    ask: 'Which way does the ray go?',
    choices: [
      'Straight ahead: applyMatrix4 turns it like the scanner',
      "Off course: the scanner's position got mixed in",
      'Straight ahead: normalize strips the position back out',
    ],
    answer: 1,
    why: "`applyMatrix4` treats the vector as a place, so it adds the scanner's position: `ahead` becomes (6, 1, −1), which points mostly sideways. `normalize` only changes the length, so the position stays mixed in. Use `transformDirection(scanner.matrixWorld)`, which leaves out the move.",
  },
  {
    code: `const velocity = new Vector3(0, 0, 4); // 4 units a second, measured from the kart
const facing = kart.getWorldQuaternion(new Quaternion());`,
    ask: 'Which line turns `velocity` the way the kart faces and keeps its speed?',
    choices: [
      '`velocity.applyQuaternion(facing)`',
      '`velocity.transformDirection(kart.matrixWorld)`',
      '`velocity.applyMatrix4(kart.matrixWorld)`',
    ],
    answer: 0,
    why: "`applyQuaternion` only turns, so the speed stays 4. `transformDirection` turns it too, but sets the length to 1, so the kart would crawl at 1 unit a second. `applyMatrix4` treats the velocity as a place and adds the kart's position.",
  },
  {
    code: `// the crane stands at (4, 0, 2) and isn't turned
const forward = crane.localToWorld(new Vector3(0, 0, 1));`,
    ask: 'What does `forward` hold?',
    choices: [
      '(4, 0, 3), just in front of the crane',
      '(0, 0, 1), which way the crane faces',
      '(4, 0, 2), where the crane itself stands',
    ],
    answer: 0,
    why: "`localToWorld` treats its input as a place: inside, it's `applyMatrix4(crane.matrixWorld)`. So it adds the crane's position and gives back a spot. For which way the crane faces, use `new Vector3(0, 0, 1).transformDirection(crane.matrixWorld)` or `crane.getWorldDirection(v)`.",
  },
];
