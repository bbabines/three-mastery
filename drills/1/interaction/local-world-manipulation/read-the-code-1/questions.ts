// Read-the-code questions for the local vs world manipulation page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `rail.rotation.y = Math.PI / 4;     // the rail runs at an angle
carriage.rotation.y = Math.PI / 4; // lined up with it; both are in the scene
carriage.position.x += 1;          // slide it along the rail?`,
    ask: 'Where does the carriage go?',
    choices: ['1 along the rail, as it faces that way', 'Nowhere until updateMatrix is called', "1 along the world's X, off the rail"],
    answer: 2,
    why: "`position` is measured from the parent, here the scene, so `position.x` is the world's X however the carriage is turned. Use `carriage.translateX(1)`.",
  },
  {
    code: `carriage.rotation.y = Math.PI / 4;
carriage.translateX(1);`,
    ask: 'Which way does the carriage move?',
    choices: ['1 along its own X, turned with it', "1 along the world's X, unchanged by the turn", 'It turns 1 radian around its X'],
    answer: 0,
    why: "`translateX` turns the X axis by the carriage's own turn before adding it to `position`. `rotateX` is the method that turns.",
  },
  {
    code: `gizmo.attach(carriage); // turned 45°
gizmo.setSpace('world');
gizmo.setMode('scale');`,
    ask: 'Which way do the scale handles point?',
    choices: ['Along its own axes, whatever the space', "Along the world's axes, since space is world", 'They hide, since scale needs local space'],
    answer: 0,
    why: "Scale handles always follow the object's own axes, since stretching a turned object along a world axis would skew it.",
  },
  {
    code: `panel.rotation.x = Math.PI / 4; // tilted
panel.add(knob);
knob.rotation.z = 0.3;
knob.rotateOnWorldAxis(new Vector3(0, 1, 0), 0.5);`,
    ask: 'Which axis does the knob turn around?',
    choices: ["The world's Y, straight up", 'Its own Y, tilted with the knob', "The panel's Y, tilted with the panel"],
    answer: 2,
    why: "Under a turned parent, `rotateOnWorldAxis` turns around the parent's axis. Bring a true world axis into the panel's axes first, with the panel's inverted world quaternion.",
  },
  {
    code: `// part sits on a cart that is turned a quarter turn
const axis = new Vector3(1, 0, 0).applyQuaternion(part.quaternion);
// the drag code treats axis as a direction in the world`,
    ask: 'What does `axis` really hold?',
    choices: ['Its own X, as the cart measures it', 'Its own X, in the world, as intended', "The world's X, since (1, 0, 0) is the world's"],
    answer: 0,
    why: "`part.quaternion` is measured from the cart, so `axis` ignores the cart's turn. Use `part.getWorldQuaternion(q)` for its own X in the world.",
  },
];
