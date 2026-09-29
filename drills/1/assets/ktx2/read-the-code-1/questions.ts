// Read-the-code questions for the KTX2 and Basis textures page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// fabric.jpg: 1024 × 1024, a 200 KB file
const fabric = await new TextureLoader().loadAsync('/textures/fabric.jpg');
sofa.material.map = fabric; // drawn with mipmaps, the default`,
    ask: 'About how much GPU memory does the texture take?',
    choices: [
      'About 5.6 MB: 4 bytes a pixel, plus mipmaps',
      'About 200 KB: the JPG stays compressed on the GPU',
      'About 800 KB: the file size, times 4 for each channel',
    ],
    answer: 0,
    why: "The GPU can't read JPG, so the image is decoded to raw pixels: 1024 × 1024 × 4 bytes is about 4.2 MB, and mipmaps add a third, about 5.6 MB. The file's size doesn't enter into it; only the pixel count and the format do.",
  },
  {
    code: `const ktx2 = new KTX2Loader().setTranscoderPath('/basis/');
const oak = await ktx2.loadAsync('/textures/oak.ktx2');`,
    ask: 'What happens?',
    choices: [
      'It fails: detectSupport(renderer) was never called',
      'It loads: as raw RGBA, since no GPU format was picked',
      'It loads: as ASTC, the format it uses by default',
    ],
    answer: 0,
    why: "KTX2Loader can't choose a format until it knows what this GPU reads, and `detectSupport(renderer)` is how it finds out. Without it, the load fails with \"Missing initialization with `.detectSupport( renderer )`.\" Chain it on when you create the loader.",
  },
  {
    code: `ktx2.detectSupport(renderer); // this GPU reads none of ASTC, BC7, ETC, or the others
const oak = await ktx2.loadAsync('/textures/oak.ktx2'); // 2048 × 2048, with mipmaps`,
    ask: 'About how much GPU memory does `oak` take?',
    choices: [
      'About 22 MB, the same as a decoded JPG would take',
      'About 5.6 MB, like on any other device',
      'None, since the load fails without support',
    ],
    answer: 0,
    why: "With no compressed format to transcode to, KTX2Loader falls back to raw RGBA: 4 bytes a pixel, 2048 × 2048 × 4 plus a third for mipmaps, about 22 MB. The load works; only the saving is lost.",
  },
];
