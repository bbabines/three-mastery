// Read-the-code questions for the drag on a plane page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const floor = new Plane(new Vector3(0, 1, 0), 0);
raycaster.setFromCamera(ndc, camera);
raycaster.ray.intersectPlane(floor, hit);`,
    ask: 'What does `hit` hold?',
    choices: ['The nearest mesh under the pointer, if any', 'The spot on the floor under the pointer', 'The point one unit out along the ray'],
    answer: 1,
    why: "`intersectPlane` finds where the ray crosses the plane: here the floor under the pointer, in the world. It knows nothing about meshes; that's `intersectObject`.",
  },
  {
    code: `// the crate's origin is the middle of its base; the user grabs it near a corner
function onPointerMove() {
  raycaster.setFromCamera(ndc, camera);
  if (raycaster.ray.intersectPlane(floor, hit)) crate.position.copy(hit);
}`,
    ask: 'What happens on the first move?',
    choices: ['It slides, that corner under the pointer', 'It sinks halfway into the floor', 'It jumps to put its origin under the pointer'],
    answer: 2,
    why: "Copying the hit into `position` puts the crate's origin under the pointer. Save the grab offset on the press and place the crate at `hit` plus `offset`.",
  },
  {
    code: `// mid-drag, the pointer moves above the horizon
const got = raycaster.ray.intersectPlane(floor, hit);
if (got) crate.position.copy(hit).add(offset);`,
    ask: 'What does the crate do?',
    choices: ['It flies off along the ray, into the sky', 'It stays put, since got is null', 'It snaps back to where the drag began'],
    answer: 1,
    why: 'Above the horizon the floor is behind the ray, so `intersectPlane` returns `null` and leaves `hit` alone. The check skips the move.',
  },
  {
    code: `// the crate sits on a cart that is turned a quarter turn
if (raycaster.ray.intersectPlane(floor, hit)) {
  crate.position.copy(hit).add(offset);
}`,
    ask: 'Where does the crate go?',
    choices: ['Under the pointer: both are in the world', 'Somewhere else: position is from the cart', 'Under the pointer: three.js converts spaces'],
    answer: 1,
    why: "`hit` is in the world, but `position` is measured from the turned cart. Measure the offset in the world, then set `crate.parent.worldToLocal(hit.add(offset))`.",
  },
  {
    code: `const normal = camera.getWorldDirection(new Vector3());
plane.setFromNormalAndCoplanarPoint(normal, first.point);`,
    ask: 'How does the grabbed object move?',
    choices: ['Across the floor, the same as a floor plane', 'Across the view, at the depth it was grabbed', 'Toward and away from the camera, with the pointer'],
    answer: 1,
    why: 'A plane facing the camera runs parallel to the screen, so the object slides across the view at the depth where it was grabbed.',
  },
];
