// Read-the-code questions for the lights tour. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `RectAreaLightUniformsLib.init();
const softbox = new RectAreaLight(0xffffff, 8, 2, 1); // the only light
softbox.lookAt(shelf.position);
shelf.material = new MeshLambertMaterial({ color: 'white' });`,
    ask: 'How does the shelf look?',
    choices: ['Dark, since RectAreaLight skips Lambert', 'Softly lit, like under a real softbox', 'Lit, with a sharp shadow under it'],
    answer: 0,
    why: 'RectAreaLight lights only `MeshStandardMaterial` and `MeshPhysicalMaterial`, and gives no error for others. Switch the shelf to `MeshStandardMaterial`.',
  },
  {
    code: `// copied from an old tutorial
renderer.useLegacyLights = true;
const bulb = new PointLight(0xffffff, 1);
bulb.position.set(0, 4, 0); // 4 units above the floor`,
    ask: 'How does the bulb light the floor?',
    choices: [
      'As the tutorial shows, with old lighting back',
      'Not at all, since the renderer throws an error',
      'Dimly, fading with the distance squared',
    ],
    answer: 2,
    why: "`useLegacyLights` no longer exists, so setting it does nothing. 1 candela, 4 units away, fades to a sixteenth. Tune old tutorials' intensities by eye.",
  },
  {
    code: `const sun = new DirectionalLight(0xffffff, 3);
sun.position.set(0, 5, 0);
sun.target.position.set(4, 0, 0); // aim at the far shelf
scene.add(sun); // sun.target is never added`,
    ask: 'Which way does the light shine?',
    choices: ['Straight down, toward the origin', 'Down at a slant, toward the far shelf', 'Along the way the sun object is turned'],
    answer: 0,
    why: "A target that isn't in the scene never updates its world position, so it stays at the origin. Add it: `scene.add(sun, sun.target)`.",
  },
];
