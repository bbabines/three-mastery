// Read-the-code questions for the debug views page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// lit: a dark patch on the tank, like a shadow
tank.material = new MeshNormalMaterial();
// now the patch shows as a different color from the rest of the side`,
    ask: "What's wrong with the tank?",
    choices: [
      'A lamp nearby is casting a shadow on that spot',
      'Its normals point the wrong way on that patch',
      'Its texture has a dark stain on that spot',
    ],
    answer: 1,
    why: "`MeshNormalMaterial` ignores lights and textures, and colors each point by the way its normal faces. A shadow or a stained texture would vanish in this view; a patch that keeps a color of its own has normals that face somewhere else. Bad normals aren't only a lighting problem: this view shows them directly.",
  },
  {
    code: `mesh.material = new MeshNormalMaterial();
// then orbit the camera halfway around the mesh`,
    ask: 'What happens to the colors?',
    choices: [
      'They change, since they are measured from the camera',
      'They stay put, since the normals belong to the mesh',
      'They go black, since the camera now sees the back',
    ],
    answer: 0,
    why: "`MeshNormalMaterial` shows normals measured from the camera (view space), so a surface facing the camera is always blue-violet, and every color shifts as you orbit. For colors that stay put, show world-space normals with a small shader, as on the debug output page.",
  },
  {
    code: `const camera = new PerspectiveCamera(50, aspect, 0.01, 1000);
scene.overrideMaterial = new MeshDepthMaterial();
// the model sits about 5 units from the camera`,
    ask: 'What does the depth view look like?',
    choices: [
      'Almost black all over',
      'A smooth fade from white to black',
      'Almost white all over',
    ],
    answer: 0,
    why: "Most of the depth range is used up right in front of the camera, and more so the smaller `near` is. With `near` at 0.01, something 5 units away already sits at the far end of the range, so it comes out nearly black. Raise `near` as far as the scene allows, and the shades spread out.",
  },
];
