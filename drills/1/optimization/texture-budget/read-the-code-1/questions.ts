// Read-the-code questions for the texture budget page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// a thumbnail in a product picker: 120 × 120 CSS pixels, at a pixel ratio of 2
thumb.material.map = await loader.loadAsync('chair-4096.jpg');`,
    ask: 'Compared with a 256 × 256 version, what does the 4096 texture buy?',
    choices: [
      'Nothing you can see, for about 89 MB instead of 0.35 MB',
      'A sharper thumbnail, since more pixels means more detail',
      'Sharper only on high-density screens with a ratio of 2',
    ],
    answer: 0,
    why: 'The thumbnail covers 240 × 240 device pixels, so the GPU draws it from a mip level about that size, and a 256 texture already has that much detail. The 4096 version looks exactly the same and holds about 89 MB of GPU memory, plus its download and upload.',
  },
  {
    code: `const materials = colors.map((color) =>
  new MeshStandardMaterial({ color, map: weave }), // 60 colors, one grayscale weave texture
);`,
    ask: 'How many copies of the weave end up on the GPU?',
    choices: ['60, one for each material', 'One for each color that is drawn', 'One, shared by all 60 materials'],
    answer: 2,
    why: 'Materials hold a reference to the texture, not a copy, so all 60 share one upload. `color` multiplies the map, so one gray weave gives every color.',
  },
  {
    code: `console.log(renderer.capabilities.maxTextureSize); // 4096 on this phone
floor.material.map = await loader.loadAsync('floor-8192.png');`,
    ask: 'What happens when the floor is first drawn?',
    choices: [
      'three.js shrinks it to 4096 × 4096 and logs a warning',
      'The floor draws black, since the texture is too big',
      'The GPU splits it into four 4096 tiles',
    ],
    answer: 0,
    why: 'three.js checks each image against the largest size the device takes and scales it down as it uploads, warning that the texture "has been resized". The download of the full size and the resize were wasted work: ship sizes the target devices can use.',
  },
  {
    code: `TextureUtils.getByteLength(2048, 2048, RGBAFormat, UnsignedByteType);           // a PNG, once decoded
TextureUtils.getByteLength(2048, 2048, RGBA_ASTC_4x4_Format, UnsignedByteType); // the same, as KTX2 in ASTC`,
    ask: 'How do the two numbers compare?',
    choices: ['They match, since both decode to the same pixels', 'The ASTC one is a quarter of the PNG one', "The ASTC one is about the PNG file's size"],
    answer: 1,
    why: "A PNG is unpacked to 4 bytes a pixel before it's uploaded, whatever its file size: 16.8 MB here. ASTC is a format the GPU reads directly, so a KTX2 texture stays compressed on the GPU, at 1 byte a pixel: 4.2 MB (the KTX2 and Basis textures page).",
  },
];
