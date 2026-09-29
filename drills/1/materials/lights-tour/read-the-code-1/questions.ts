// Read-the-code questions for the lights tour. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `RectAreaLightUniformsLib.init();
const softbox = new RectAreaLight(0xffffff, 8, 2, 1);
softbox.lookAt(shelf.position);
shelf.material = new MeshLambertMaterial({ color: 'white' });`,
    ask: 'The softbox is the only light. How does the shelf look?',
    choices: ['Dark, since RectAreaLight skips Lambert', 'Softly lit, like under a real softbox', 'Lit, but with a sharp shadow under it'],
    answer: 0,
    why: "RectAreaLight lights only `MeshStandardMaterial` and `MeshPhysicalMaterial`, and it casts no shadows at all. A Lambert, Phong, or Toon material under it gets no light and no error. Switch the shelf to `MeshStandardMaterial`.",
  },
  {
    code: `// copied from a tutorial written for an older three.js
renderer.useLegacyLights = true;
const bulb = new PointLight(0xffffff, 1);
bulb.position.set(0, 4, 0); // 4 units above the floor`,
    ask: 'In r186, how does the bulb light the floor below it?',
    choices: [
      'Just as the tutorial shows, since the switch brings back the old lighting',
      'Not at all, since the renderer refuses a setting it no longer knows',
      'Dimly, since r186 has no such switch and fades light by distance squared',
    ],
    answer: 2,
    why: "r186 has no `useLegacyLights`; setting it just adds an unused property. Intensities are physically based: 1 candela, 4 units away, fades to a sixteenth, which is dim. Old tutorials' numbers don't carry over, so tune intensities by eye.",
  },
  {
    code: `const sun = new DirectionalLight(0xffffff, 3);
sun.position.set(0, 5, 0);
sun.target.position.set(4, 0, 0); // aim at the far shelf
scene.add(sun); // sun.target is never added`,
    ask: 'Which way does the light shine?',
    choices: ['Straight down, toward the origin', 'Down at a slant, toward the far shelf', 'Along the way the sun object is turned'],
    answer: 0,
    why: "A DirectionalLight shines from its `position` toward its `target`. A target that isn't in the scene never has its world position updated, so it stays at the origin. Add it: `scene.add(sun, sun.target)`. Turning the light with `rotation` does nothing.",
  },
];
