// Read-the-code questions for the texture sampling page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// "mipmaps only speed things up, and we're fast enough"
floorTexture.generateMipmaps = false;
floorTexture.minFilter = LinearFilter;`,
    ask: 'What changes on the long, tiled floor?',
    choices: ['The far part sparkles as the camera moves', 'Nothing, apart from less GPU memory', 'The whole floor blurs, near and far'],
    answer: 0,
    why: 'Far away, the GPU reads just a few texels per pixel, a different few each frame, so the pattern shimmers. Keep the default `LinearMipmapLinearFilter`.',
  },
  {
    code: `renderer.render(scene, camera); // the floor has been drawn
floorTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
// no needsUpdate`,
    ask: 'Does the floor get sharper at grazing angles?',
    choices: ['Yes, from the very next frame', 'No, not until it goes to the GPU again', 'Yes, but only near the camera'],
    answer: 1,
    why: 'Filters and anisotropy go to the GPU with the image, so a later change waits for `floorTexture.needsUpdate = true`. Set them before the first draw.',
  },
  {
    code: `const icon = new TextureLoader().load('/ui/pixel-icon.png'); // 16 × 16 pixel art
button.material = new MeshBasicMaterial({ map: icon }); // shown 256 pixels wide`,
    ask: 'How does the icon look?',
    choices: ['Blurry, its pixels smeared together', 'Crisp, each pixel a sharp square', 'Shimmering, since it has no mipmaps'],
    answer: 0,
    why: 'Magnified, the default `magFilter`, `LinearFilter`, blends neighboring texels, so pixel art smears. Set `icon.magFilter = NearestFilter`.',
  },
];
