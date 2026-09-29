// Read-the-code questions for the triage page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const panel = new Mesh(geometry, new MeshStandardMaterial({ color: 'orange' }));
scene.add(panel); // no light is added anywhere
renderer.render(scene, camera);`,
    ask: 'The canvas is black and the console is clean. Which bucket is the bug in?',
    choices: [
      'Material: a lit material with no light draws black',
      'Shader: the material failed to compile on the GPU',
      'Camera: the panel is outside what it can see',
    ],
    answer: 0,
    why: "`MeshStandardMaterial` reacts to lights, and with none in the scene it draws the panel pure black, on a canvas that's cleared to black. A shader that failed to compile would have printed `THREE.WebGLProgram: Shader Error` in the console. The material check, a `MeshBasicMaterial`, brings the panel back.",
  },
  {
    code: `model.scale.setScalar(0.001); // convert millimeters to meters
const size = new Box3().setFromObject(model).getSize(new Vector3());
console.log(size); // (0.0018, 0.0009, 0.0006)`,
    ask: "The model doesn't show up. What does the log point to?",
    choices: [
      'A camera bug: the far plane is too close',
      'A transform bug: it was already in meters',
      'A geometry bug: the file lost its triangles',
    ],
    answer: 1,
    why: "The box around it is about 2 millimeters across, so the model is there, just tiny: `setScalar(0.001)` shrank a model that was already in meters. A far plane that's too close wouldn't change the size in the log, and a model with nothing in it would log an empty box.",
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
    why: "Drawing straight to the screen uses the same objects, materials, and camera, and skips only the extra passes. So the scene itself is fine, and the bug is in the pipeline: how the composer puts the frame together, like a missing `RenderPass`.",
  },
  {
    code: `part.material = new MeshBasicMaterial({ color: '#f97316' }); // the check
// on screen, the part still isn't #f97316`,
    ask: 'Where is the bug?',
    choices: [
      'In the lights: the sun is too bright or tinted too blue',
      'After the material: output color space or tone mapping',
      'In the normals: the faces point away from the light',
    ],
    answer: 1,
    why: "`MeshBasicMaterial` ignores lights and normals, so neither can change its color. If it still doesn't match, something after the material changed it: `renderer.outputColorSpace` or `renderer.toneMapping`, both in the pipeline bucket. The color spaces and tone mapping pages cover them.",
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
    why: "`DoubleSide` draws both sides of every triangle, so if that brings the panel back, its fronts were facing away: its corners are listed in the wrong order, as on the winding order page. A missing light or a far plane wouldn't change with `side`. Fix the corner order rather than leaving `DoubleSide` on.",
  },
];
