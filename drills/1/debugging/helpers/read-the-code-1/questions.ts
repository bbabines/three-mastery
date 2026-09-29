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
    why: "A shadow-casting light renders the scene from its own camera, `sun.shadow.camera`, which for a directional light sees a box. `CameraHelper` draws any camera's view, so it draws that box. Nothing outside it casts a shadow, which is why a shadow cut off at one edge means the box is too small.",
  },
  {
    code: `const bounds = new BoxHelper(crate);
scene.add(bounds);
crate.position.x += 2;`,
    ask: 'Where is the box drawn at the next render?',
    choices: [
      'Around the crate, since helpers follow on their own',
      'Nowhere, until the crate stops moving',
      'Around the spot the crate just left',
    ],
    answer: 2,
    why: "`BoxHelper` works out its box once, when it's made, and again only when you call `bounds.update()`. Until then it marks where the crate was. A `Box3Helper` does follow its `Box3` every frame, but the `Box3` itself doesn't follow the crate.",
  },
  {
    code: `mesh.position.set(3, 0, 0);
const normals = new VertexNormalsHelper(mesh, 0.2);
mesh.add(normals);`,
    ask: 'Where are the normal lines drawn?',
    choices: ['Around x = 6, moved twice', 'Around x = 3, on the mesh', 'Around the origin'],
    answer: 0,
    why: "`VertexNormalsHelper` works its lines out in the world, with the mesh's move already in them. Added as the mesh's child, it gets the mesh's move again, so the lines float 3 units past the mesh. Add it to the scene instead, and call `normals.update()` after the mesh moves.",
  },
];
