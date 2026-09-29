// Read-the-code questions for the materials tour. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const tag = new Mesh(plane, new MeshBasicMaterial({ color: '#f97316' }));
scene.add(tag);
sun.intensity = 0; // sun is the only light in the scene`,
    ask: 'How does the tag look now?',
    choices: ['The same full orange as before', 'Black, since no light reaches it now', 'A dimmer orange, from the light left over'],
    answer: 0,
    why: "`MeshBasicMaterial` is unlit: it ignores lights entirely and shows its color as is. That's why labels and UI use it. Matcap, Normal, and Depth materials ignore lights too.",
  },
  {
    code: `const scene = new Scene(); // no lights, no environment
scene.background = new Color('white');
scene.add(new Mesh(box, new MeshStandardMaterial({ color: 'orange' })));
renderer.render(scene, camera);`,
    ask: 'What shows on screen?',
    choices: ['An orange box, lit evenly from every side', 'Only white, as a mesh with no light is skipped', 'A black box, drawn against the white background'],
    answer: 2,
    why: '`MeshStandardMaterial` is lit: with no light and no environment, no light reaches it, so it draws black. It still draws, which is why it shows against the white. Add a light, or an environment (the environment maps page).',
  },
  {
    code: `part.material = new MeshNormalMaterial();
// then orbit the camera around the part`,
    ask: 'What happens to the colors as the camera orbits?',
    choices: [
      'They shift, since the directions are measured from the camera',
      'They stay put, since each face keeps the color it started with',
      'They darken on whichever side faces away from the lights',
    ],
    answer: 0,
    why: "`MeshNormalMaterial` colors each pixel by the way the surface faces, measured from the camera, so orbiting changes the colors. It ignores lights, so nothing darkens. It's a quick debug view for checking normals.",
  },
];
