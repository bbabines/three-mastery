// Read-the-code questions for the traverse variants page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// safety holds a pin Group, and the pin holds two Meshes
safety.visible = false;
const found = [];
model.traverseVisible((o) => { if (o.isMesh) found.push(o); });`,
    ask: "Are the pin's two Meshes in `found`?",
    choices: [
      'Yes: their own visible property is still true',
      'No: nothing under a hidden object is visited',
      'Yes: it skips safety itself, not its children',
    ],
    answer: 1,
    why: "`traverseVisible` stops at `safety` and never goes below it. The pin's Meshes still say `visible = true`, but the walk never reaches them to ask. `traverse` would find them.",
  },
  {
    code: `// the rack: 20 Meshes, all inside its five parts
const meshes = gltf.scene.children.filter((object) => object.isMesh);`,
    ask: 'What is `meshes.length`?',
    choices: ['20', '5', '0'],
    answer: 2,
    why: "`children` is only the first level: the rack's five parts, and none of them is a Mesh. `gltf.scene.traverse` reaches the Meshes further down.",
  },
  {
    code: `// tube is a Group holding two Meshes
let count = 0;
tube.traverse(() => {
  count += 1;
});`,
    ask: 'What is `count` afterwards?',
    choices: ['2', '3', '1'],
    answer: 1,
    why: '`traverse` calls the function on `tube` itself first, then on each Mesh. To leave out the object you started from, check `object !== tube`.',
  },
  {
    code: `// knob is a Mesh in pin, pin is in safety, safety is in model,
// and model is in the scene, which has no name
const names = [];
knob.traverseAncestors((object) => names.push(object.name));`,
    ask: 'What does `names` hold?',
    choices: ["`['knob', 'pin', 'safety', 'model', '']`", "`['', 'model', 'safety', 'pin']`", "`['pin', 'safety', 'model', '']`"],
    answer: 2,
    why: "It starts at the parent, not at `knob`, and works up, nearest first, to the scene, whose name is the empty string. Handle `knob` itself before the walk if you need it.",
  },
  {
    code: `// the scene holds 20,000 objects, and 3 of them spin
renderer.setAnimationLoop(() => {
  scene.traverse((o) => { if (o.userData.spins) o.rotation.y += 0.01; });
  renderer.render(scene, camera);
});`,
    ask: "What's wrong with this loop?",
    choices: [
      'Slow: it walks every object, every frame, for 3',
      "Nothing: traverse skips objects that haven't changed",
      "It throws: objects can't change inside traverse",
    ],
    answer: 0,
    why: 'It works, but it spends CPU time every frame walking the whole scene to find the same three objects. Collect them once, after loading, and loop over that list.',
  },
];
