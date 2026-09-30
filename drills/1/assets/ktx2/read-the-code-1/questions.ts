// Read-the-code questions for the KTX2 and Basis textures page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// fabric.jpg: 1024 × 1024, a 200 KB file
const fabric = await new TextureLoader().loadAsync('/textures/fabric.jpg');
sofa.material.map = fabric; // drawn with mipmaps, the default`,
    ask: 'About how much GPU memory does it take?',
    choices: ['About 200 KB, the file size', 'About 5.6 MB, with mipmaps', 'About 800 KB, the file size × 4'],
    answer: 1,
    why: "The GPU can't read JPG, so it's decoded to 4 bytes a pixel, about 4.2 MB, and mipmaps add a third. The file size doesn't enter into it.",
  },
  {
    code: `const ktx2 = new KTX2Loader().setTranscoderPath('/basis/');
const oak = await ktx2.loadAsync('/textures/oak.ktx2');`,
    ask: 'What happens?',
    choices: [
      'It loads as raw RGBA, since no format was picked',
      'It loads as ASTC, the format used by default',
      'It fails, since detectSupport was never called',
    ],
    answer: 2,
    why: 'KTX2Loader picks a format only after `detectSupport(renderer)` tells it what this GPU reads, so the load fails. Chain it on when you create the loader.',
  },
  {
    code: `ktx2.detectSupport(renderer); // this GPU reads no compressed format
const oak = await ktx2.loadAsync('/textures/oak.ktx2'); // 2048 × 2048, with mipmaps`,
    ask: 'About how much GPU memory does `oak` take?',
    choices: ['About 5.6 MB, like on any device', 'About 22 MB, like a decoded JPG', 'None, since the load fails'],
    answer: 1,
    why: 'With no format to transcode to, KTX2Loader falls back to raw 4-byte pixels, about 22 MB with mipmaps. The load works; only the saving is lost.',
  },
];
