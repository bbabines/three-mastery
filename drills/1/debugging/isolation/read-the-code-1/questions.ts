// Read-the-code questions for the isolation page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const parts = rack.children; // 300 parts, and a flicker somewhere
parts.forEach((part, i) => (part.visible = i < 150));
// the flicker is still there`,
    ask: "What's the quickest next step?",
    choices: [
      'Read the code for parts 0 to 149, one by one',
      'Show only parts 0 to 74 and look again',
      'Show all 300 and hide one part at a time',
    ],
    answer: 1,
    why: 'The flicker is in the first 150, so halve them again: nine checks cover all 300. Hiding one part at a time can take 300 checks.',
  },
  {
    code: `scene.overrideMaterial = new MeshNormalMaterial();
// the dark patch on the tank is still there,
// now as a patch of the wrong color`,
    ask: 'Where is the bug?',
    choices: [
      "In the tank's material, like a bad texture",
      'In the lighting, too dim on that side',
      "In the tank's shape, in its normals there",
    ],
    answer: 2,
    why: "`overrideMaterial` ignores lights and textures, so a patch that survives it comes from the shape's own data: its normals.",
  },
  {
    code: `const test = new Scene();
test.add(new HemisphereLight(0xffffff, 0x444444, 2), valve.clone());
renderer.render(test, camera);
// the valve looks right here`,
    ask: 'What does that tell you?',
    choices: [
      'The cause is in the scene around the valve',
      "The valve's own material is what's broken",
      'Cloning the valve repaired its geometry',
    ],
    answer: 0,
    why: 'The valve looks right on its own, so the bug comes from something the full scene adds: its lights, environment, post-processing, or another object. `clone()` repaired nothing.',
  },
  {
    code: `cable.visible = false;
renderer.render(scene, camera);
console.log(renderer.info.render.triangles); // 401,500 before, 1,500 now`,
    ask: 'What have you learned?',
    choices: [
      'Hiding the cable freed its GPU memory',
      'The cable is what makes the frame slow',
      'The cable holds nearly every triangle drawn',
    ],
    answer: 2,
    why: "The cable is 400,000 of the 401,500 triangles, so that's where the work is. Whether it slows the frame takes measuring, and a hidden mesh keeps its GPU memory.",
  },
  {
    code: `scene.overrideMaterial = new MeshBasicMaterial({ color: 'white' });
camera.near = 1;
bin.visible = false;
// the flicker is gone`,
    ask: 'What caused the flicker?',
    choices: [
      "Can't tell: three things changed at once",
      'The bin: hiding it made the flicker stop',
      'The near plane: raising it fixed the depth',
    ],
    answer: 0,
    why: 'Any one of the three could have stopped it. Undo all three, then change one at a time, putting each back before the next.',
  },
];
