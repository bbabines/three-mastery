// Read-the-code questions for the axis-angle page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `fan.rotation.z = MathUtils.degToRad(30); // leaning
// every frame:
fan.rotateOnAxis(new Vector3(0, 1, 0), 2 * delta);`,
    ask: 'Which line does the fan spin around?',
    choices: ['Its own Y axis, which leans 30° along with it', "The world's upright Y axis, straight up", "The world's Z, where the lean was set"],
    answer: 0,
    why: "`rotateOnAxis` reads the axis as measured from the fan itself, so (0, 1, 0) is the fan's own Y, which leans with it: the fan spins in place like a tilted desk fan. `rotateOnWorldAxis` would spin it around the upright Y instead, and its lean would swing around in a circle.",
  },
  {
    code: `const hinge = new Vector3(1, 1, 0); // along the lid's slanted edge
lid.setRotationFromAxisAngle(hinge, Math.PI / 2);`,
    ask: 'What goes wrong?',
    choices: [
      'Nothing goes wrong, because three.js normalizes the axis for you',
      'The lid turns, but also comes out stretched and skewed',
      "It throws an error, since the axis isn't length 1",
    ],
    answer: 1,
    why: "three.js assumes the axis is unit length and doesn't check. (1, 1, 0) is about 1.41 long, so the quaternion comes out longer than 1, and that stretches the lid as well as turning it: its corners stop being square. Use `new Vector3(1, 1, 0).normalize()`.",
  },
  {
    code: `turntable.rotation.x = MathUtils.degToRad(90); // tipped onto its side
turntable.add(vase);
vase.rotateOnWorldAxis(new Vector3(0, 1, 0), 0.5);`,
    ask: 'Which line in the world does the vase turn around?',
    choices: [
      "World Z: it's really the tipped turntable's Y",
      'World Y: the upright world axis, as the method name says',
      "The vase's own Y: the same as rotateOnAxis would use",
    ],
    answer: 0,
    why: "`rotateOnWorldAxis` measures the axis from the vase's parent, the turntable, and the turntable's Y now points along the world's Z. three.js's source notes the method assumes no turned parent. To turn around the true world Y, turn the axis into the parent's space first with the inverse of `turntable.getWorldQuaternion(q)`.",
  },
];
