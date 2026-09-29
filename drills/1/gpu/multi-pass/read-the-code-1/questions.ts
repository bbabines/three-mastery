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
      'Almost nothing, since it only darkens the edges',
      'One draw call, so about as much as a mesh',
    ],
    answer: 0,
    why: 'A full-screen pass runs its fragment shader for every pixel of its picture, the edges and the untouched middle alike: 3840 × 2160 = 8.3 million fragments, every frame. It is one draw call, but a draw call covering the whole screen. Each extra pass adds that again, which is why stacking effects gets expensive at high pixel ratios.',
  },
  {
    code: `renderer.toneMapping = ACESFilmicToneMapping;
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(size, 0.8, 0.4, 0.85));
// no OutputPass`,
    ask: 'How does the frame look on the canvas?',
    choices: [
      'Right: the renderer tone maps whatever it draws',
      'Too dark: no tone mapping and no sRGB conversion',
      'Right, minus the bloom: that needs OutputPass',
    ],
    answer: 1,
    why: 'RenderPass draws into a render target, and three.js skips tone mapping and the sRGB conversion there, so the bloom works on linear colors. With no `OutputPass` at the end, those linear colors go straight to the canvas. Add `new OutputPass()` as the last pass (or use r186\'s `renderer.setEffects` with `outputBufferType: HalfFloatType`, which applies both itself).',
  },
  {
    code: `const outline = new OutlinePass(size, scene, camera, [selectedPart]);
composer.addPass(outline);`,
    ask: 'Besides its full-screen passes, what else does OutlinePass do every frame?',
    choices: [
      'Nothing, since it only reads the finished picture',
      'It renders the scene twice more',
      'It adds one draw call for the selected part',
    ],
    answer: 1,
    why: 'OutlinePass renders the whole scene twice more, once to record the depth of everything else and once to mask the selected objects, before about eight full-screen passes. So it costs draw calls and vertex work as well as pixel work. A stencil outline, on the stencil page, is the single-draw-call alternative.',
  },
  {
    code: `const composer = new EffectComposer(renderer);
window.addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
});`,
    ask: 'The window is resized. What goes wrong?',
    choices: [
      'Nothing, since the composer follows the renderer',
      "The composer's pictures keep the old size",
      'The scene is drawn twice, once per size',
    ],
    answer: 1,
    why: 'The composer reads the renderer\'s size and pixel ratio once, when it\'s created, and sizes its render targets and passes from them. After a resize, call `composer.setSize(innerWidth, innerHeight)` too, or the passes keep working at the old size and the old-sized picture is stretched over the new canvas.',
  },
];
