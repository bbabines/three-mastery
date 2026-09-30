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
    why: 'A ray runs one way only, here toward −Z, and the crate sits behind the start. Put the crate at z = −4 and the ray hits it.',
  },
  {
    code: `const aim = new Vector3(0, 0, -0.5); // the way the sensor faces
raycaster.set(sensor.position, aim);
const hits = raycaster.intersectObject(crate); // 5 units ahead, dead center`,
    ask: 'What does the raycast find?',
    choices: ['The crate, at its real distance', 'Nothing, though the crate is dead ahead', 'The crate, at twice its real distance'],
    answer: 1,
    why: "`set` keeps the direction as given, and three.js's quick check against each bounding sphere assumes length 1, so it rules the crate out. Normalize `aim` first.",
  },
  {
    code: `// the only wall stands 2 units past the player, on the same line
const toPlayer = player.getWorldPosition(new Vector3()).sub(eye); // 6 long
raycaster.set(eye, toPlayer.clone().normalize());
raycaster.far = toPlayer.length();
const blocked = raycaster.intersectObjects(walls).length > 0;`,
    ask: 'What is `blocked`?',
    choices: [
      '`true`, because the ray runs on past the player',
      '`true`, because `far` limits the camera, not rays',
      '`false`, because hits past `far` are left out',
    ],
    answer: 2,
    why: "`far` is a distance along the ray, so hits farther than 6 are dropped and the wall doesn't count. Left at `Infinity`, it would block the view.",
  },
];
