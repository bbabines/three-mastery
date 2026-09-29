// Read-the-code questions for the add vs attach page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// the chair sits straight in the scene, at (1, 0, 2)
const group = new Group();
group.position.set(3, 0, 0);
scene.add(group);
group.add(chair);`,
    ask: 'Where is the chair in the world now?',
    choices: ['(4, 0, 2)', '(1, 0, 2)', '(−2, 0, 2)'],
    answer: 0,
    why: "`add` keeps `chair.position` at (1, 0, 2), but now it's measured from the group, which sits 3 to the right, so the chair jumps to (4, 0, 2). `group.attach(chair)` would keep it at (1, 0, 2) in the world by changing its position to (−2, 0, 2).",
  },
  {
    code: `hand.attach(cup);  // pick up
// … the player walks across the room …
scene.add(cup);    // put down`,
    ask: 'Where does the cup land?',
    choices: ['Right where the hand let go of it', 'Back where it was before the pick-up', 'Near the center of the scene'],
    answer: 2,
    why: "After `attach`, the cup's position is its small offset from the hand. `scene.add` keeps those numbers but reads them from the center of the scene, so the cup lands near (0, 0, 0). `scene.attach(cup)` puts it down where the hand left it.",
  },
  {
    code: `// the bolt sits in the scene with a scale of (1, 1, 1)
rack.scale.setScalar(0.01); // the rack model is in centimeters
rack.attach(bolt);
console.log(bolt.scale);`,
    ask: 'What does it log?',
    choices: ['(100, 100, 100)', '(1, 1, 1)', '(0.01, 0.01, 0.01)'],
    answer: 0,
    why: "`attach` keeps the bolt the same size in the world. Inside a rack that shrinks everything to 0.01, that takes a scale of 100. `rack.add(bolt)` would have kept (1, 1, 1), and the bolt would shrink to a hundredth of its size.",
  },
];
