// Read-the-code questions for the materials tour. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const tag = new Mesh(plane, new MeshBasicMaterial({ color: '#f97316' }));
scene.add(tag);
sun.intensity = 0; // the scene's only light`,
    ask: 'How does the tag look now?',
    choices: ['The same full orange as before', 'Black, since no light reaches it now', 'A dimmer orange, from light left over'],
    answer: 0,
    why: '`MeshBasicMaterial` is unlit, so it ignores lights and shows its color as is. Matcap, Normal, and Depth materials ignore lights too.',
  },
  {
    code: `const scene = new Scene(); // no lights, no environment
scene.background = new Color('white');
scene.add(new Mesh(box, new MeshStandardMaterial({ color: 'orange' })));`,
    ask: 'What shows on screen?',
    choices: ['An orange box, lit evenly all over', 'Only white, since a mesh with no light is skipped', 'A black box against the white'],
    answer: 2,
    why: '`MeshStandardMaterial` is lit, and no light reaches it, so it draws black, which shows against the white. Add a light or `scene.environment`.',
  },
  {
    code: `part.material = new MeshNormalMaterial();
// then orbit the camera around the part`,
    ask: 'What do the colors do as you orbit?',
    choices: [
      'They shift, since they depend on the camera',
      'They stay put, since each face keeps its color',
      'They darken on the side away from the light',
    ],
    answer: 0,
    why: '`MeshNormalMaterial` colors each pixel by the way the surface faces, measured from the camera, so orbiting changes the colors. It ignores lights.',
  },
];
