// Read-the-code questions for the texture sampling page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// "mipmaps only speed things up, and we're fast enough"
floorTexture.generateMipmaps = false;
floorTexture.minFilter = LinearFilter;`,
    ask: 'What changes on the long, tiled warehouse floor?',
    choices: ['The far part sparkles as the camera moves', 'Nothing, apart from a little less GPU memory', 'The whole floor blurs, near and far alike'],
    answer: 0,
    why: "Far away, one pixel covers many texels. Without mipmaps, the GPU reads just a few of them, a different few every frame as the view moves, so fine patterns shimmer. Mipmaps average them ahead of time. Keep the default `LinearMipmapLinearFilter`.",
  },
  {
    code: `renderer.render(scene, camera); // the floor has been drawn
floorTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
// no needsUpdate`,
    ask: 'Does the floor get sharper at grazing angles?',
    choices: ['Yes, from the very next frame', 'No, not until the texture is sent to the GPU again', 'Yes, but only on the part closest to the camera'],
    answer: 1,
    why: "Filters, wrapping, and anisotropy are sent to the GPU with the image. After the first draw, changing them does nothing until `floorTexture.needsUpdate = true` uploads it again. Set them before the first draw.",
  },
  {
    code: `const icon = new TextureLoader().load('/ui/pixel-icon.png'); // 16 × 16 pixel art
button.material = new MeshBasicMaterial({ map: icon }); // shown 256 pixels wide`,
    ask: 'How does the icon look?',
    choices: ['Blurry, its pixels smeared together', 'Crisp, with each pixel a sharp square', 'Shimmering, since the icon has no mipmaps'],
    answer: 0,
    why: "Magnified, the default `magFilter`, `LinearFilter`, blends neighboring texels, so pixel art smears. Set `icon.magFilter = NearestFilter` to show each texel as a sharp square. Mipmaps only matter when a texture is shrunk, not enlarged.",
  },
];
