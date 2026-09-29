// Read-the-code questions for the ray page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `raycaster.set(new Vector3(0, 1, 0), new Vector3(0, 0, -1));
crate.position.set(0, 1, 4); // on the same line, 4 units behind the start
crate.updateMatrixWorld();
const hits = raycaster.intersectObject(crate);`,
    ask: 'What does `hits` hold?',
    choices: ['An empty array', 'A hit with a distance of −3.5', 'A hit 3.5 units from the start'],
    answer: 0,
    why: 'A ray runs one way only, along its direction, here toward −Z. The crate is on +Z, behind the start, so nothing is hit. Put the crate at z = −4 and it would be hit 3.5 units along the ray.',
  },
  {
    code: `const aim = new Vector3(0, 0, -0.5); // the way the sensor faces
raycaster.set(sensor.position, aim);
const hits = raycaster.intersectObject(crate); // 5 units ahead, dead center`,
    ask: 'What does the raycast find?',
    choices: ['The crate, at its real distance', 'Nothing, though the crate is dead ahead', 'The crate, at twice its real distance'],
    answer: 1,
    why: "`set` stores the direction as given, and three.js's quick check against each object's bounding sphere assumes length 1. With length 0.5 that check rules the crate out. `raycaster.set(sensor.position, aim.clone().normalize())` finds it.",
  },
  {
    code: `const toPlayer = player.getWorldPosition(new Vector3()).sub(eye); // 6 long
raycaster.set(eye, toPlayer.clone().normalize());
raycaster.far = toPlayer.length();
const blocked = raycaster.intersectObjects(walls).length > 0;`,
    ask: 'The only wall stands 2 units past the player, on the same line. What is `blocked`?',
    choices: [
      '`true`, because the ray runs on past the player',
      '`true`, because `far` limits the camera, not rays',
      '`false`, because hits past `far` are left out',
    ],
    answer: 2,
    why: '`far` is a distance along the ray, in world units: hits farther than 6 are dropped, so the wall behind the player doesn\'t count. With `far` left at `Infinity`, it would, and the guard would think the view was blocked.',
  },
];
