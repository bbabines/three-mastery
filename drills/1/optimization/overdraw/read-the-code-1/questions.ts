// Read-the-code questions for the overdraw reduction page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// flash: a white plane covering the whole view, transparent: true
flash.material.opacity = 0; // the fade after a click has ended`,
    ask: 'What does the invisible flash cost each frame?',
    choices: [
      'Nothing, since the GPU skips clear pixels',
      'Only its draw call, since no pixel changes',
      'A full screen of pixel work, as before',
    ],
    answer: 2,
    why: 'Opacity 0 is still a draw: every pixel the flash covers is shaded and blended, with no visible result. `flash.visible = false` skips it completely.',
  },
  {
    code: `const fog = new MeshBasicMaterial({ color: 'gray', transparent: true, opacity: 0.1 });
const layers = Array.from({ length: 8 }, () => new Mesh(bigPlane, fog));
layers.forEach((layer, i) => (layer.position.z = -i * 0.5)); // each covers the whole view
scene.add(...layers);`,
    ask: 'How much pixel work do the fog layers add?',
    choices: [
      'Eight full screens, one for each layer',
      'Under one full screen, each only 10% opaque',
      'One full screen, since they cover the same pixels',
    ],
    answer: 0,
    why: "Each layer is shaded at every pixel it covers, whatever its opacity, and see-through layers don't hide each other. One layer at 0.57 looks the same, for an eighth of the work.",
  },
  {
    code: `fence.material.transparent = false;
fence.material.alphaTest = 0.5; // the texture: solid wire and fully clear holes`,
    ask: 'What changes, compared with blending?',
    choices: [
      'Its holes are never shaded, so they cost nothing',
      'It writes depth, but its holes are still shaded',
      'Nothing, since alphaTest needs transparent too',
    ],
    answer: 1,
    why: '`alphaTest` keeps each fragment solid or throws it away, so the fence writes depth and needs no sorting. But the throwing away happens inside the fragment shader, after the holes are shaded.',
  },
];
