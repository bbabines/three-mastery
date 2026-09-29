// Read-the-code questions for the tone mapping and exposure page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// renderer.toneMapping is left at its default
sun.intensity = 10;
product.material = new MeshStandardMaterial({ color: '#e8d9c4' }); // cream`,
    ask: 'What happens to the part of the product facing the sun?',
    choices: ['It clips to a flat white patch with no detail', 'It keeps its detail, since three.js rescales it', 'It stays cream, just a little brighter'],
    answer: 0,
    why: 'The default is `NoToneMapping`, which cuts every value above 1 off at 1. The bright side works out far above 1, so it clips to flat white: a blown highlight. A tone mapping such as `NeutralToneMapping` bends those values down and keeps the shading.',
  },
  {
    code: `renderer.toneMapping = NoToneMapping;
renderer.toneMappingExposure = 2;`,
    ask: 'How much brighter does the scene get?',
    choices: ['Not at all, as if it were never set', 'Twice as bright, everywhere at once', 'Brighter, but only in the dark parts'],
    answer: 0,
    why: 'Exposure is part of the tone mapping step, and with `NoToneMapping` three.js leaves that whole step out of the shader. Pick a tone mapping first, then set the exposure.',
  },
  {
    code: `renderer.toneMapping = ACESFilmicToneMapping;
logo.material = new MeshBasicMaterial({ color: '#e4572e' }); // unlit`,
    ask: 'What color does the logo show on screen?',
    choices: ['Exactly #e4572e, since the logo is unlit', 'Exactly #e4572e, since only values above 1 change', 'Close to it, but shifted by the curve'],
    answer: 2,
    why: "Tone mapping runs on every material with `toneMapped: true`, the default, lit or not, and ACES shifts hue and saturation even well below white. Set `toneMapped: false` on the logo's material to show the color exactly.",
  },
  {
    code: `renderer.toneMapping = AgXToneMapping;
renderer.setRenderTarget(thumbnailTarget);
renderer.render(scene, camera);
renderer.setRenderTarget(null);`,
    ask: 'Is the picture in `thumbnailTarget` tone mapped?',
    choices: ['No, since render targets skip tone mapping', 'Yes, the same as the canvas would be', 'Yes, and the canvas then gets it a second time'],
    answer: 0,
    why: 'three.js tone maps only when drawing to the canvas. A render target keeps the linear, unmapped colors, so anything shown from it later needs the tone mapping applied then, as an `OutputPass` does for an `EffectComposer`.',
  },
  {
    code: `// a paint configurator: the finishes must look like the brand's colors
renderer.toneMapping = NeutralToneMapping;`,
    ask: 'Why pick this tone mapping here?',
    choices: ["It's built to keep base colors close to the source", 'It leaves every color exactly as it was set', "It's the default, so it costs nothing extra"],
    answer: 0,
    why: '`NeutralToneMapping` is designed for product work: it keeps hues close and takes only a small, equal amount off each channel below its highlights. It still changes colors a little, and it isn\'t the default; `NoToneMapping` is.',
  },
];
