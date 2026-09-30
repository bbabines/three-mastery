// Read-the-code questions for the readback page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `canvas.addEventListener('pointermove', (event) => {
  renderPickPixel(event); // the ID scene, into a 1 × 1 target
  renderer.readRenderTargetPixels(pickTarget, 0, 0, 1, 1, pixel);
});`,
    ask: 'What does reading this one pixel cost?',
    choices: [
      'Almost nothing, since it is only 4 bytes',
      'A wait for all the GPU work queued before it',
      'A second full render of the whole scene',
    ],
    answer: 1,
    why: 'The pixel depends on every command queued before the read, so JavaScript stops until the GPU has worked through them all. `readRenderTargetPixelsAsync` asks without waiting.',
  },
  {
    code: `renderer.readRenderTargetPixelsAsync(pickTarget, 0, 0, 1, 1, pixel);
highlight(pixel[0]); // the picked object's ID`,
    ask: 'What goes wrong?',
    choices: [
      'Nothing, async just runs a bit faster',
      'It throws, as async calls need await',
      'pixel is read before the answer arrives',
    ],
    answer: 2,
    why: 'The async version returns a promise and fills `pixel` later, so the next line reads old values. `await` it, and the highlight follows a frame or so later.',
  },
  {
    code: `// the renderer was created with the default preserveDrawingBuffer: false
saveButton.onclick = () => {
  link.href = renderer.domElement.toDataURL('image/png');
};`,
    ask: 'What does the saved image show?',
    choices: [
      'The last frame, exactly as it was shown',
      'Nothing, since the canvas was cleared',
      'The next frame, once it is drawn',
    ],
    answer: 1,
    why: "Without `preserveDrawingBuffer`, the browser clears the canvas once it's shown, and a click arrives between frames. Render and read in one go, or set `preserveDrawingBuffer: true`.",
  },
];
