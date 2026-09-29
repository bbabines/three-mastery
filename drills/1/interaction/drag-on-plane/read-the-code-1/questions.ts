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
    why: "`intersectPlane` finds where the ray crosses the plane: here the floor at y = 0, under the pointer, in the world. It knows nothing about meshes; that's `raycaster.intersectObject`. It writes the spot into `hit` and returns it, or returns `null` if the ray never reaches the floor.",
  },
  {
    code: `// the crate's origin is the middle of its base
function onPointerMove() {
  raycaster.setFromCamera(ndc, camera);
  if (raycaster.ray.intersectPlane(floor, hit)) crate.position.copy(hit);
}`,
    ask: 'The user grabs the crate near one corner and starts to drag. What happens?',
    choices: ['It slides, that corner under the pointer', 'It sinks halfway into the floor', 'It jumps to put its origin under the pointer'],
    answer: 2,
    why: "The hit is where the pointer's ray meets the floor, and copying it into `position` puts the crate's origin there, so on the first move the crate jumps until the middle of its base is under the pointer. Save the grab offset on the press, `offset.copy(crate.position).sub(grabbed)`, and place the crate at `hit` plus `offset`.",
  },
  {
    code: `const got = raycaster.ray.intersectPlane(floor, hit);
if (got) crate.position.copy(hit).add(offset);`,
    ask: 'Mid-drag, the user moves the pointer above the horizon. What does the crate do?',
    choices: ['It flies off along the ray, into the sky', 'It stays put, since got is null', 'It snaps back to where the drag began'],
    answer: 1,
    why: "Above the horizon the ray points up, away from the floor, so the floor is behind it and `intersectPlane` returns `null` without touching `hit`. The check skips the move and the crate waits where it was. Without the check, it would jump to whatever `hit` held.",
  },
  {
    code: `// the crate sits on a cart that is turned a quarter turn
if (raycaster.ray.intersectPlane(floor, hit)) {
  crate.position.copy(hit).add(offset);
}`,
    ask: 'Where does the crate go?',
    choices: [
      'Under the pointer: hit and position are both in the world',
      'Somewhere else: position is measured from the cart',
      'Under the pointer: three.js converts spaces for you',
    ],
    answer: 1,
    why: "`hit` is in the world, but `position` is measured from the cart, which is turned, so the same numbers mean a different spot. Measure the offset in the world on the press, then convert on each move: `crate.position.copy(crate.parent.worldToLocal(hit.add(offset)))`.",
  },
  {
    code: `const normal = camera.getWorldDirection(new Vector3());
plane.setFromNormalAndCoplanarPoint(normal, first.point);`,
    ask: 'How does the grabbed object move with the pointer?',
    choices: [
      'Across the floor, the same as a floor plane',
      'Across the view, at the same depth as the grab',
      'Toward and away from the camera, with the pointer',
    ],
    answer: 1,
    why: 'A plane that faces the camera runs parallel to the screen, so every spot on it is the same distance in front of the camera. The object slides across the view at the depth where it was grabbed: handy for moving something freely in front of you.',
  },
];
