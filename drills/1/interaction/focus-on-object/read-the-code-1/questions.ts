// Read-the-code questions for the focus on object page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// focus on the drawer, whose center is at (4, 1, 0)
camera.position.set(4, 1, 2);
// OrbitControls keeps running, with its target still at (0, 1, 0)`,
    ask: 'What does the view show once the controls update?',
    choices: ['The drawer, centered, 2 units in front of it', 'The old target, seen from the new spot', 'The drawer, until the user next drags the view'],
    answer: 1,
    why: "Every `controls.update()` turns the camera toward `controls.target`, which still sits at (0, 1, 0). The camera arrives in front of the drawer but looks away from it, and the next orbit circles the old spot. Move the target to the drawer's center along with the camera.",
  },
  {
    code: `elapsed += delta;
const t = elapsed / 0.8;
camera.position.lerpVectors(from, to, t);
controls.target.lerpVectors(fromTarget, toTarget, t);`,
    ask: 'What happens once 0.8 seconds have passed?',
    choices: ['Both stop at the part, since t reached 1', 'Both keep going, past the part', 'Both jump back to where they started'],
    answer: 1,
    why: '`lerpVectors` doesn\'t stop at 1: with `t` at 1.5 it goes half the distance again past the end. Clamp it: `const t = MathUtils.clamp(elapsed / 0.8, 0, 1)`, and stop the animation once it reaches 1.',
  },
  {
    code: `controls.saveState();   // at startup
// later, on the "Reset view" button:
controls.reset();`,
    ask: 'What does the reset look like?',
    choices: ['The camera goes back, but the target stays', 'The camera glides back, with damping', 'The camera and the target jump straight back'],
    answer: 2,
    why: "`reset()` copies the saved camera position, target, and zoom straight back and updates once, so it's a jump, even with damping on. To glide home, animate to `controls.position0` and `controls.target0`, where `saveState()` keeps them.",
  },
];
