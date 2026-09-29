// Read-the-code questions for the readback page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `canvas.addEventListener('pointermove', (event) => {
  renderPickPixel(event); // the ID scene, into a 1 × 1 target
  renderer.readRenderTargetPixels(pickTarget, 0, 0, 1, 1, pixel);
});`,
    ask: 'What does reading this single pixel cost on each move?',
    choices: [
      'Almost nothing, since it is only 4 bytes',
      'A wait until the GPU has finished all queued work',
      'A second full render of the whole scene',
    ],
    answer: 1,
    why: 'The pixel depends on every command queued before the read, so JavaScript stops at that line until the GPU has worked through the whole queue, then copies 4 bytes. The wait is for the queue, not the size. `readRenderTargetPixelsAsync` asks the same question without making JavaScript wait.',
  },
  {
    code: `renderer.readRenderTargetPixelsAsync(pickTarget, 0, 0, 1, 1, pixel);
highlight(pixel[0]); // the picked object's ID`,
    ask: 'What goes wrong?',
    choices: [
      'Nothing: async only means it runs a bit faster',
      'It throws: async calls need await',
      'Too early: pixel is read before the answer',
    ],
    answer: 2,
    why: 'The async version returns a promise and fills `pixel` later, once the GPU has caught up, so the next line reads whatever `pixel` held before. `await` it (or use `.then`), and the highlight follows a frame or so after the pointer, without the page ever waiting.',
  },
  {
    code: `// the renderer was created with the default preserveDrawingBuffer: false
saveButton.onclick = () => {
  link.href = renderer.domElement.toDataURL('image/png');
};`,
    ask: 'What does the saved image show?',
    choices: [
      'The last frame: what was on screen',
      'Blank: the canvas was cleared',
      'The next frame: once the renderer draws it',
    ],
    answer: 1,
    why: 'Without `preserveDrawingBuffer`, the browser clears the canvas\'s picture once it has shown it, and a click arrives between frames. Render and read in one go (`renderer.render(scene, camera)` then `toDataURL`), or create the renderer with `preserveDrawingBuffer: true`. `toDataURL` is itself a readback, plus the PNG encoding.',
  },
];
