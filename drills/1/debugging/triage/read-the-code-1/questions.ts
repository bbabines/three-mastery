// Read-the-code questions for the triage page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const panel = new Mesh(geometry, new MeshStandardMaterial({ color: 'orange' }));
scene.add(panel); // no light is added anywhere
renderer.render(scene, camera);
// the canvas is black, and the console is clean`,
    ask: 'Which bucket is the bug in?',
    choices: [
      'Material: a lit material with no light is black',
      'Shader: the material failed to compile',
      'Camera: the panel is outside what it sees',
    ],
    answer: 0,
    why: 'With no light, `MeshStandardMaterial` draws the panel black on a black canvas. A failed compile would print `THREE.WebGLProgram: Shader Error`. The material check, a `MeshBasicMaterial`, brings it back.',
  },
  {
    code: `model.scale.setScalar(0.001); // convert millimeters to meters
const size = new Box3().setFromObject(model).getSize(new Vector3());
console.log(size); // (0.0018, 0.0009, 0.0006), and the model doesn't show`,
    ask: 'What does the log point to?',
    choices: [
      'A camera bug: the far plane is too close',
      'A transform bug: it was already in meters',
      'A geometry bug: the file lost its triangles',
    ],
    answer: 1,
    why: 'The box is about 2 millimeters across, so the model is there, just tiny: it was already in meters. A model with no triangles would log an empty box.',
  },
  {
    code: `// the check: skip the composer for one frame
renderer.render(scene, camera); // in place of composer.render()
// the scene appears`,
    ask: 'What has the check ruled out?',
    choices: [
      'Only the shaders of the post-processing passes',
      'Nothing, because it changed too many things',
      'Transform, geometry, material, and camera',
    ],
    answer: 2,
    why: 'Drawing straight to the canvas uses the same objects, materials, and camera, and skips only the extra passes. So the bug is in the pipeline, like a missing `RenderPass`.',
  },
  {
    code: `part.material = new MeshBasicMaterial({ color: '#f97316' }); // the check
// on screen, the part still isn't #f97316`,
    ask: 'Where is the bug?',
    choices: [
      'In the lights: the sun is tinted too blue',
      'After the material: color space or tone mapping',
      'In the normals: they face away from the light',
    ],
    answer: 1,
    why: "`MeshBasicMaterial` ignores lights and normals, so something after the material changed the color: `renderer.outputColorSpace` or `renderer.toneMapping`, in the pipeline bucket.",
  },
  {
    code: `panel.material.side = DoubleSide; // the check
// the panel appears`,
    ask: 'What did the check show?',
    choices: [
      'Its material had no light to show it',
      "It was sitting past the camera's far plane",
      'Its triangles face away from the camera',
    ],
    answer: 2,
    why: '`DoubleSide` draws both sides, so the fronts faced away: the corners are listed in the wrong order. Fix the corner order rather than leaving `DoubleSide` on.',
  },
];
