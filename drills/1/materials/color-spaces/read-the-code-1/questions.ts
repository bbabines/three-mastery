// Read-the-code questions for the color spaces page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const photo = await new TextureLoader().loadAsync('/textures/fabric.jpg'); // richly colored
sofa.material.map = photo;`,
    ask: 'How does the fabric look on the sofa?',
    choices: ['Paler and washed out, with weak colors', 'Exactly as rich as the photo file', 'Darker and more saturated than the file'],
    answer: 0,
    why: "A texture you load yourself starts at `NoColorSpace`, so the photo's sRGB numbers are read as linear, then converted again on the way out. Add `photo.colorSpace = SRGBColorSpace`.",
  },
  {
    code: `const maps = [baseColor, normal, roughness];
for (const map of maps) map.colorSpace = SRGBColorSpace;`,
    ask: 'Which of the maps are now set wrong?',
    choices: ['None, since every texture is sRGB', 'Only baseColor, which should stay linear', 'normal and roughness, which hold numbers'],
    answer: 2,
    why: 'Only color maps are sRGB. Marking a normal or roughness map sRGB bends every number it holds, so leave data maps at `NoColorSpace`.',
  },
  {
    code: `// the brand color: #e4572e, or 228, 87, 46 in the picker
logo.material = new MeshBasicMaterial();
logo.material.color.setRGB(228 / 255, 87 / 255, 46 / 255);`,
    ask: 'How does the logo compare with the brand color?',
    choices: ["An exact match, from the picker's numbers", 'Lighter and paler than the brand color', 'Darker and redder than the brand color'],
    answer: 1,
    why: "`setRGB` reads linear numbers unless its fourth argument says `SRGBColorSpace`, so the picker's sRGB numbers come out lighter. Use `color.set('#e4572e')`.",
  },
  {
    code: `const gray = new Color('#808080');
console.log(gray.r);`,
    ask: 'What does it log?',
    choices: ['0.5, halfway between black and white', '128, the byte from the hex code', 'About 0.22, the same gray in linear'],
    answer: 2,
    why: '`Color` stores linear numbers, and halfway gray in sRGB is about 0.22 in linear. `gray.getHexString()` converts back and gives `808080`.',
  },
  {
    code: `renderer.outputColorSpace = LinearSRGBColorSpace;`,
    ask: 'What happens to the whole picture?',
    choices: ['It gets too dark, heavy in the shadows', 'Nothing, since the lighting is linear anyway', 'It gets pale, as if washed out'],
    answer: 0,
    why: 'Screens read what they get as sRGB, so linear numbers sent straight there come out too dark. Leave `outputColorSpace` at `SRGBColorSpace`.',
  },
];
