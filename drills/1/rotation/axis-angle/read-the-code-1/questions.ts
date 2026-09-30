// Read-the-code questions for the axis-angle page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `fan.rotation.z = MathUtils.degToRad(30); // leaning
// every frame:
fan.rotateOnAxis(new Vector3(0, 1, 0), 2 * delta);`,
    ask: 'Which line does the fan spin around?',
    choices: ['Its own Y, which leans 30° with the fan', "The world's upright Y, straight up", "The world's Z, where the lean was set"],
    answer: 0,
    why: "`rotateOnAxis` measures the axis from the fan itself, so (0, 1, 0) is the fan's own leaning Y. Use `rotateOnWorldAxis` to spin around the upright Y.",
  },
  {
    code: `const hinge = new Vector3(1, 1, 0); // along the lid's slanted edge
lid.setRotationFromAxisAngle(hinge, Math.PI / 2);`,
    ask: 'What goes wrong?',
    choices: ['Nothing, since three.js normalizes it', 'The lid turns, but comes out skewed', 'It throws an error about the length'],
    answer: 1,
    why: "three.js assumes the axis has length 1 and doesn't check, so a longer axis stretches the lid as well as turning it. Use `hinge.normalize()` first.",
  },
  {
    code: `turntable.rotation.x = MathUtils.degToRad(90); // tipped onto its side
turntable.add(vase);
vase.rotateOnWorldAxis(new Vector3(0, 1, 0), 0.5);`,
    ask: 'Which world line does the vase turn around?',
    choices: ["World Z, the turntable's tipped Y", 'World Y, as the method name says', "The vase's own Y, like rotateOnAxis"],
    answer: 0,
    why: "`rotateOnWorldAxis` measures the axis from the parent, and the turntable's Y now points along world Z. Turn the axis by the inverse of the parent's world quaternion first.",
  },
];
