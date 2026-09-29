// Read-the-code questions for the color spaces page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const photo = await new TextureLoader().loadAsync('/textures/fabric.jpg');
sofa.material.map = photo;`,
    ask: 'The fabric photo is richly colored. How does it look on the sofa?',
    choices: ['Paler and washed out, with weak colors', 'Exactly as rich as the photo file', 'Darker and more saturated than the file'],
    answer: 0,
    why: "A texture you load yourself starts at `NoColorSpace`, so the photo's sRGB numbers are used as if they were linear, then converted to sRGB again on the way to the screen, which lifts every color. Add `photo.colorSpace = SRGBColorSpace`.",
  },
  {
    code: `const maps = [baseColor, normal, roughness];
for (const map of maps) map.colorSpace = SRGBColorSpace;`,
    ask: 'Which of the maps are now set wrong?',
    choices: ['None, since every texture is sRGB', 'Only baseColor, which should stay linear', 'normal and roughness, which hold numbers'],
    answer: 2,
    why: 'Only color maps are sRGB. A normal map holds directions and a roughness map holds amounts; marking them sRGB converts their numbers as if they were colors, which bends every normal and changes every roughness. Leave data maps at `NoColorSpace`.',
  },
  {
    code: `// the brand color from the designer: #e4572e, or 228, 87, 46
logo.material = new MeshBasicMaterial();
logo.material.color.setRGB(228 / 255, 87 / 255, 46 / 255);`,
    ask: 'How does the logo compare with the brand color?',
    choices: ['An exact match, since the numbers came from the picker', 'Lighter and paler than the brand color', 'Darker and redder than the brand color'],
    answer: 1,
    why: "`setRGB` takes linear numbers unless its fourth argument says otherwise, but picker numbers are sRGB. Read as linear, they come out lighter: `#f39e76`. Use `color.set('#e4572e')`, or pass `SRGBColorSpace` as the fourth argument.",
  },
  {
    code: `const gray = new Color('#808080');
console.log(gray.r);`,
    ask: 'What does it log?',
    choices: ['0.5, halfway between black and white', '128, the byte from the hex code', 'About 0.22, the same gray in linear numbers'],
    answer: 2,
    why: '`Color` stores linear numbers. `#808080` is halfway in sRGB, which is about 0.22 in linear light. `gray.getHexString()` gives `808080` back, because it converts to sRGB on the way out.',
  },
  {
    code: `renderer.outputColorSpace = LinearSRGBColorSpace;`,
    ask: 'What happens to the whole picture?',
    choices: ['It gets too dark, heavy in the shadows', 'Nothing, since the lighting is linear anyway', 'It gets pale, as if washed out'],
    answer: 0,
    why: "Screens read what they get as sRGB. Sending linear numbers straight to the screen skips the last conversion, so the midtones come out too dark. Leave `outputColorSpace` at its default, `SRGBColorSpace`.",
  },
];
