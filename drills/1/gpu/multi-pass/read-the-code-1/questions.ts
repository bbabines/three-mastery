// Read-the-code questions for the multi-pass and post-processing page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `renderer.setPixelRatio(2); // a 1920 × 1080 canvas
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new ShaderPass(VignetteShader));
composer.addPass(new OutputPass());`,
    ask: 'What does the vignette pass alone cost each frame?',
    choices: [
      'Its shader, for all 8.3 million pixels',
      'Almost nothing, since it only darkens edges',
      'One draw call, about as much as a mesh',
    ],
    answer: 0,
    why: 'A full-screen pass runs its fragment shader for every pixel, the untouched middle too: 3840 × 2160, every frame. Each extra pass adds that again.',
  },
  {
    code: `renderer.toneMapping = ACESFilmicToneMapping;
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(size, 0.8, 0.4, 0.85));
// no OutputPass`,
    ask: 'How does the frame look on the canvas?',
    choices: [
      'Right, since the renderer tone maps it all',
      'Too dark, with no tone mapping or sRGB',
      'Right, but without the bloom',
    ],
    answer: 1,
    why: 'RenderPass draws into a render target, which skips tone mapping and the sRGB conversion, so linear colors reach the canvas. Add `new OutputPass()` as the last pass.',
  },
  {
    code: `const outline = new OutlinePass(size, scene, camera, [selectedPart]);
composer.addPass(outline);`,
    ask: 'What else does OutlinePass do every frame?',
    choices: [
      'Nothing, since it only reads the picture',
      'It renders the whole scene twice more',
      'It adds one draw call for the part',
    ],
    answer: 1,
    why: 'OutlinePass renders the scene twice more before its full-screen passes, so it costs draw calls and vertex work too. A stencil outline takes one draw call.',
  },
  {
    code: `const composer = new EffectComposer(renderer);
window.addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
});`,
    ask: 'The window is resized. What goes wrong?',
    choices: [
      'Nothing, since the composer follows it',
      "The composer's pictures keep the old size",
      'The scene is drawn twice, once per size',
    ],
    answer: 1,
    why: "The composer reads the renderer's size once, when it's created. Call `composer.setSize(innerWidth, innerHeight)` in the resize handler too.",
  },
];
