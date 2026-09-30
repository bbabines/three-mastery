// Read-the-code questions for the helpers page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `renderer.shadowMap.enabled = true;
sun.castShadow = true;
scene.add(new CameraHelper(sun.shadow.camera));`,
    ask: 'What does the helper draw?',
    choices: [
      'Nothing, because a light is not a camera',
      "The box the sun's shadows are rendered from",
      'An arrow along the direction of the sunlight',
    ],
    answer: 1,
    why: "A shadow-casting light renders from its own camera, which for a directional light sees a box. `CameraHelper` draws any camera's view, so it draws that box.",
  },
  {
    code: `const bounds = new BoxHelper(crate);
scene.add(bounds);
crate.position.x += 2;`,
    ask: 'Where is the box drawn at the next render?',
    choices: [
      'Around the crate, since helpers follow it',
      'Nowhere, until the crate stops moving',
      'Around the spot the crate just left',
    ],
    answer: 2,
    why: '`BoxHelper` works out its box when it is made, and again only on `bounds.update()`. Until then it marks where the crate was.',
  },
  {
    code: `mesh.position.set(3, 0, 0);
const normals = new VertexNormalsHelper(mesh, 0.2);
mesh.add(normals);`,
    ask: 'Where are the normal lines drawn?',
    choices: ['Around x = 6, moved twice', 'Around x = 3, on the mesh', 'Around the origin'],
    answer: 0,
    why: "`VertexNormalsHelper` works its lines out in the world, the mesh's move included, and as a child it gets that move again. Add it to the scene instead.",
  },
];
