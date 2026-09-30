// Read-the-code questions for the axis-constrained drag page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// drag up to raise the shelf
plane.setFromNormalAndCoplanarPoint(new Vector3(0, 1, 0), grabbed);
if (raycaster.ray.intersectPlane(plane, hit)) shelf.position.y = hit.y;`,
    ask: 'What does the shelf do as the user drags up?',
    choices: ['It rises and falls, following the pointer', 'It drops to the floor, at y = 0', 'It stays put, as every hit has one height'],
    answer: 2,
    why: 'A level plane has the same height everywhere, so `hit.y` never changes. To drag along Y, use an upright plane that contains the Y axis and faces the camera.',
  },
  {
    code: `const axis = new Vector3(1, 0, 0);
move.subVectors(hit, grabbed);   // (0.4, 0.3, 0) since the press
part.position.copy(start).addScaledVector(axis, move.dot(axis));`,
    ask: 'How far does the part end up from `start`?',
    choices: ['0.4 along X', '0.5, the whole length of the move', '0.4 along X and 0.3 up'],
    answer: 0,
    why: 'With a length-1 axis, `move.dot(axis)` is the part of the move along it: 0.4. The 0.3 upward is dropped, which keeps the part on its line.',
  },
  {
    code: `// the user orbits to the far side of the rail, then drags right
canvas.addEventListener('pointermove', (event) => {
  if (dragging) carriage.position.x += event.movementX * 0.01;
});`,
    ask: 'Which way does the carriage move on screen?',
    choices: ['Right, following the pointer', 'Left, away from the pointer', 'Nowhere, since the camera turned'],
    answer: 1,
    why: "A drag right always adds to the world's +X, which points left on screen from the far side. A ray, a plane, and `dot` follow the pointer from any side.",
  },
  {
    code: `const axis = new Vector3(2, 0, 0); // along the rail
part.position.copy(start).addScaledVector(axis, move.dot(axis));
// the hit has moved 0.1 along the rail`,
    ask: 'How far does the part move?',
    choices: ['0.1, since only the direction counts', '0.2, twice as far as the pointer', '0.4, four times as far as the pointer'],
    answer: 2,
    why: "`dot` scales by the axis's length once and `addScaledVector` scales again, giving 0.4. Normalize the axis, or write it with length 1.",
  },
  {
    code: `carriage.position.x += event.movementX * 0.01;
// the user dollies far out, so the rail looks small`,
    ask: 'How does the carriage keep up now?',
    choices: ['It lags behind the pointer on screen', 'It keeps up, since both count pixels', 'It races ahead of the pointer on screen'],
    answer: 0,
    why: 'Far away, one pixel covers more of the world, so 0.01 units a pixel falls behind. The ray and the plane keep the grabbed spot under the pointer at any distance.',
  },
];
