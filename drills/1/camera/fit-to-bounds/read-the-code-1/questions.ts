// Read-the-code questions for the fit to bounds page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// A phone held upright: camera.aspect is 0.5 and camera.fov is 50.
const distance = sphere.radius / Math.sin(MathUtils.degToRad(camera.fov) / 2);
camera.position.copy(sphere.center).addScaledVector(back, distance);`,
    ask: 'How does the model fit?',
    choices: ['It fits, with room to spare', 'Its top and bottom are cut off', 'Its sides are cut off'],
    answer: 2,
    why: "`fov` is the angle from bottom to top. On a screen half as wide as it is tall, the side-to-side angle is only about 26°, so a camera backed off for 50° is too close to fit the model across. Use the narrower of the two angles.",
  },
  {
    code: `const box = new Box3().setFromObject(group); // nothing has loaded into the group yet
const sphere = box.getBoundingSphere(new Sphere());
const distance = sphere.radius / Math.sin(fov / 2);`,
    ask: 'What goes wrong?',
    choices: ['It throws an error for an empty box', 'The distance comes out negative', 'The distance comes out as 0'],
    answer: 1,
    why: "An empty `Box3` gives a sphere with a radius of −1, and nothing warns you. The distance comes out negative, so the camera lands on the wrong side of the center, facing away. Check `box.isEmpty()` before fitting.",
  },
  {
    code: `camera.aspect = 2; // a wide window
const vertical = MathUtils.degToRad(camera.fov);
const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * camera.aspect);
const angle = Math.min(vertical, horizontal);`,
    ask: 'Which angle does `angle` hold?',
    choices: [
      "The vertical one, since it's narrower",
      "The horizontal one, since it's wider",
      'Whichever the camera used last',
    ],
    answer: 0,
    why: "On a screen twice as wide as it is tall, the side-to-side angle is wider than `fov`, so the vertical one is narrower and decides the distance. On a tall screen it's the other way around, which is why the code takes the smaller of the two instead of assuming.",
  },
];
