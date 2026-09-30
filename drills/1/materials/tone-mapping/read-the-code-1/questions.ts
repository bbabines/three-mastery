// Read-the-code questions for the tone mapping and exposure page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// renderer.toneMapping is left at its default
sun.intensity = 10;
product.material = new MeshStandardMaterial({ color: '#e8d9c4' }); // cream`,
    ask: 'How does the side facing the sun look?',
    choices: ['Flat white, with no detail left', 'Detailed, since three.js rescales it', 'Cream, just a little brighter'],
    answer: 0,
    why: 'The default, `NoToneMapping`, cuts every value above 1 off at 1, so the bright side clips to flat white. `NeutralToneMapping` bends it down instead.',
  },
  {
    code: `renderer.toneMapping = NoToneMapping;
renderer.toneMappingExposure = 2;`,
    ask: 'How much brighter does the scene get?',
    choices: ['Not at all, as if it were never set', 'Twice as bright, everywhere at once', 'Brighter, but only in the dark parts'],
    answer: 0,
    why: 'Exposure is part of the tone mapping step, which `NoToneMapping` leaves out of the shader. Pick a tone mapping first, then set the exposure.',
  },
  {
    code: `renderer.toneMapping = ACESFilmicToneMapping;
logo.material = new MeshBasicMaterial({ color: '#e4572e' }); // unlit`,
    ask: 'What color does the logo show on screen?',
    choices: ['Exactly #e4572e, since the logo is unlit', 'Exactly #e4572e, as only values over 1 change', 'Close to it, but shifted by the curve'],
    answer: 2,
    why: 'Tone mapping runs on every material with `toneMapped: true`, the default, lit or not, and ACES shifts hue even below white. Set `toneMapped: false` on the logo.',
  },
  {
    code: `renderer.toneMapping = AgXToneMapping;
renderer.setRenderTarget(thumbnailTarget);
renderer.render(scene, camera);
renderer.setRenderTarget(null);`,
    ask: 'Is the picture in `thumbnailTarget` tone mapped?',
    choices: ['No, since render targets skip it', 'Yes, the same as the canvas would be', 'Yes, and the canvas then gets it twice'],
    answer: 0,
    why: 'three.js tone maps only when drawing to the canvas, so the target keeps linear, unmapped colors. Apply it when you show the target, as an `OutputPass` does.',
  },
  {
    code: `// a paint configurator: the finishes must match the brand
renderer.toneMapping = NeutralToneMapping;`,
    ask: 'Why pick this tone mapping here?',
    choices: ['It keeps base colors close to the source', 'It leaves every color exactly as set', "It's the default, so it costs nothing"],
    answer: 0,
    why: "`NeutralToneMapping` is built for product work and keeps hues close. It still changes colors a little, and it isn't the default; `NoToneMapping` is.",
  },
];
