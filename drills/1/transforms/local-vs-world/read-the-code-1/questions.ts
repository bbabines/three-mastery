// Read-the-code questions for the local vs world space lesson. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `forklift.add(headlight);
headlight.position.set(0, 1, 2);
forklift.position.set(10, 0, 0);`,
    ask: 'Where is the headlight in the world?',
    choices: ['(10, 1, 2)', '(0, 1, 2)', '(10, 0, 0)'],
    answer: 0,
    why: "The headlight's position is measured from the forklift, and the forklift sits at (10, 0, 0), so the headlight ends up 1 up and 2 forward from there. (0, 1, 2) is only its position as the forklift measures it.",
  },
  {
    code: `drone.add(parcel);
parcel.position.set(0, -1, 0); // hanging below the drone
drone.position.y += 5;         // the drone climbs
console.log(parcel.position.y);`,
    ask: 'What does it log?',
    choices: ['−1', '4', '5'],
    answer: 0,
    why: "Moving a parent carries the child along without touching the child's own numbers. The parcel is still 1 below the drone, so `position.y` is still −1. Its height in the world, 4 if the drone started at 0, comes from `parcel.getWorldPosition(v)`.",
  },
  {
    code: `shelf.scale.set(2, 2, 2);
shelf.add(bin);
bin.position.set(0, 1, 0);`,
    ask: "In the world, how far above the shelf's center is the bin?",
    choices: ['2 units', '1 unit', '0.5 units'],
    answer: 0,
    why: "A parent's size applies to everything measured from it, including its children's positions. `bin.position` still says 1, but that's 1 of the shelf's units, and the shelf is twice normal size.",
  },
  {
    code: `shelfA.add(binA);
shelfB.add(binB);
binA.position.set(0, 1, 0);
binB.position.set(0, 1, 0);
const gap = binA.position.distanceTo(binB.position);`,
    ask: 'The two shelves stand in different places. What does `gap` tell you?',
    choices: [
      'Nothing useful about where the bins are',
      'That the two bins overlap in the same spot',
      'How far apart the two shelves themselves stand',
    ],
    answer: 0,
    why: 'Each position is measured from its own shelf, so they match even though the bins are far apart, and `gap` is 0. Compare world positions instead: `binA.getWorldPosition(a).distanceTo(binB.getWorldPosition(b))`.',
  },
  {
    code: `desk.add(lamp);
const bulb = lamp.localToWorld(new Vector3(0, 0.5, 0));`,
    ask: 'What is the (0, 0.5, 0) measured from?',
    choices: ['The lamp itself', "The desk, the lamp's parent", 'The center of the scene'],
    answer: 0,
    why: "`localToWorld` reads its input as measured from the object you call it on, and gives back the same spot in the world. That's different from `lamp.position`, which is measured from the desk.",
  },
];
