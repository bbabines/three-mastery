// Draws a stage's scene straight to its canvas, the way a WebGLRenderer viewer draws it. (The
// stage already gives each scene's glass its own copy of the picture: see
// separateFramebufferCopies in stage.ts.) `before` runs at the start of every frame, timed ones too.
import type { EffectsStage } from '../stage';

export function drawScene(stage: EffectsStage, before?: () => void) {
  const { renderer, scene, camera } = stage.harness;
  stage.draw(() => {
    before?.();
    renderer.render(scene, camera);
  });
}
