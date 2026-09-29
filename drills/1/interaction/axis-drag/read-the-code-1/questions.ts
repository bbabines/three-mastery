// Read-the-code questions for the axis-constrained drag page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// drag up to raise the shelf
plane.setFromNormalAndCoplanarPoint(new Vector3(0, 1, 0), grabbed);
if (raycaster.ray.intersectPlane(plane, hit)) shelf.position.y = hit.y;`,
    ask: 'The user drags upward. What does the shelf do?',
    choices: ['It rises and falls with the pointer', 'It jumps down to the floor, at y = 0', 'It stays put, since every hit is at one height'],
    answer: 2,
    why: "A level plane has the same height everywhere, so `hit.y` never changes and the shelf never moves. To drag along Y, the plane has to contain the Y axis: an upright plane facing the camera, with its normal from `toCamera.projectOnPlane(axis)`.",
  },
  {
    code: `const axis = new Vector3(1, 0, 0);
move.subVectors(hit, grabbed);   // (0.4, 0.3, 0) since the press
part.position.copy(start).addScaledVector(axis, move.dot(axis));`,
    ask: 'How far does the part end up from `start`?',
    choices: ['0.4 along X', '0.5, the whole length of the move', '0.4 along X and 0.3 up'],
    answer: 0,
    why: '`move.dot(axis)` with a length-1 axis is the part of the move that runs along the axis: 0.4. The 0.3 upward is dropped, which is what keeps the part on its line.',
  },
  {
    code: `canvas.addEventListener('pointermove', (event) => {
  if (dragging) carriage.position.x += event.movementX * 0.01;
});`,
    ask: 'The user orbits around to the far side of the rail, then drags right. What happens on screen?',
    choices: ['It slides right, following the pointer', 'It slides left, away from the pointer', 'It stays put, since the camera turned'],
    answer: 1,
    why: "A drag to the right always adds to `position.x`, the world's +X. Seen from the far side, the world's +X points left on screen, so the carriage slides the opposite way to the pointer. A ray, a plane that contains the axis, and `dot` follow the pointer from any side.",
  },
  {
    code: `const axis = new Vector3(2, 0, 0); // along the rail
part.position.copy(start).addScaledVector(axis, move.dot(axis));`,
    ask: 'The hit moves 0.1 along the rail. How far does the part move?',
    choices: ['0.1, since only the direction counts', '0.2, twice as far as the pointer', '0.4, four times as far as the pointer'],
    answer: 2,
    why: "`dot` scales by the axis's length once, giving 0.2, and `addScaledVector` scales by it again, giving 0.4. Normalize the axis: `new Vector3(2, 0, 0).normalize()`, or write it with length 1 to begin with.",
  },
  {
    code: `carriage.position.x += event.movementX * 0.01;
// the user dollies far out, so the rail looks small`,
    ask: 'How does the carriage keep up with the pointer now?',
    choices: ['It lags behind, covering less of the screen', 'It keeps up, since both count pixels', 'It races ahead of the pointer on screen'],
    answer: 0,
    why: 'Far away, one pixel covers more of the world, so 0.01 units is less than a pixel of screen and the carriage falls behind the pointer. Up close it would race ahead. The ray and the plane keep the grabbed spot under the pointer at any distance.',
  },
];
