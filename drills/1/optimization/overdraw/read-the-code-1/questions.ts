// Read-the-code questions for the overdraw reduction page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// flash: a white plane covering the whole view, transparent: true
flash.material.opacity = 0; // the fade after a click has ended`,
    ask: 'The flash is invisible now. What does it cost each frame?',
    choices: [
      'Nothing, since the GPU skips fully transparent pixels',
      'Only its draw call, since no pixel changes color',
      'A full screen of pixel work, as when it showed',
    ],
    answer: 2,
    why: 'Opacity 0 is still a draw: every pixel the flash covers runs the fragment shader and is blended, just with no visible result. `flash.visible = false` skips it completely; set it back to `true` before the next fade in.',
  },
  {
    code: `for (let i = 0; i < 8; i++) {
  const fog = new Mesh(bigPlane, new MeshBasicMaterial({ color: 'gray', transparent: true, opacity: 0.1, depthWrite: false }));
  fog.position.z = -i * 0.5; // each layer covers the whole view
  scene.add(fog);
}`,
    ask: 'How much pixel work do the fog layers add each frame?',
    choices: [
      'Eight full screens, one for each layer',
      'Less than one full screen, since each is only 10% opaque',
      'One full screen, since the layers cover the same pixels',
    ],
    answer: 0,
    why: "Each layer is shaded and blended at every pixel it covers, whatever its opacity, and see-through layers don't hide each other. So eight full-screen layers are eight full screens of pixel work. One layer at opacity 0.57 looks the same from the front, for an eighth of the work.",
  },
  {
    code: `fence.material.transparent = false;
fence.material.alphaTest = 0.5; // the texture: solid wire and fully clear holes`,
    ask: 'What changes, compared with drawing the fence with blending?',
    choices: [
      'The holes are skipped before shading, so they cost nothing',
      'It writes depth and needs no sorting, but its holes are still shaded',
      'Nothing, since alphaTest only works together with transparent',
    ],
    answer: 1,
    why: "With `alphaTest`, each fragment is either kept solid or thrown away, so the fence is drawn with the solid objects: it writes depth, needs no back-to-front sorting, and hides what's behind its wire. The throwing away happens inside the fragment shader, though, so the holes are shaded first, and as a rule of thumb a shader that can discard can lose early-z.",
  },
];
