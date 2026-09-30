// Read-the-code questions for the texture budget page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// a thumbnail in a product picker: 120 × 120 CSS pixels, at a pixel ratio of 2
thumb.material.map = await loader.loadAsync('chair-4096.jpg');`,
    ask: 'What does 4096 buy over a 256 version?',
    choices: [
      'Nothing you can see, for 256 times the memory',
      'A sharper thumbnail, since more pixels add detail',
      'Sharper, but only on high-density screens',
    ],
    answer: 0,
    why: 'The thumbnail covers 240 × 240 device pixels, so the GPU draws it from a mip level about that size. The 4096 version looks the same and holds about 89 MB.',
  },
  {
    code: `const materials = colors.map((color) =>
  new MeshStandardMaterial({ color, map: weave }), // 60 colors, one grayscale weave texture
);`,
    ask: 'How many copies of the weave reach the GPU?',
    choices: ['60, one for each material', 'One for each color that is drawn', 'One, shared by all 60 materials'],
    answer: 2,
    why: 'Materials hold a reference to the texture, not a copy, so all 60 share one upload. `color` multiplies the map, so one gray weave gives every color.',
  },
  {
    code: `console.log(renderer.capabilities.maxTextureSize); // 4096 on this phone
floor.material.map = await loader.loadAsync('floor-8192.png');`,
    ask: 'What happens when the floor is first drawn?',
    choices: [
      'three.js shrinks it to 4096 and logs a warning',
      'The floor draws black, since it is too big',
      'The GPU splits it into four 4096 tiles',
    ],
    answer: 0,
    why: 'three.js scales each image down to the largest size the device takes as it uploads it, with a warning. The full-size download and the resize were wasted.',
  },
  {
    code: `TextureUtils.getByteLength(2048, 2048, RGBAFormat, UnsignedByteType);           // a PNG, once decoded
TextureUtils.getByteLength(2048, 2048, RGBA_ASTC_4x4_Format, UnsignedByteType); // the same, as KTX2 in ASTC`,
    ask: 'How do the two numbers compare?',
    choices: ['They match, since both decode to the same pixels', 'The ASTC one is a quarter of the PNG one', "The ASTC one is about the PNG file's size"],
    answer: 1,
    why: 'A PNG is unpacked to 4 bytes a pixel before upload, whatever its file size. ASTC is a format the GPU reads directly, at 1 byte a pixel, so KTX2 stays compressed.',
  },
];
