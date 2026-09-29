// Read-the-code questions for the traverse variants page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// safety holds a pin Group, and the pin holds two Meshes
safety.visible = false;
const found = [];
model.traverseVisible((object) => {
  if (object.isMesh) found.push(object);
});`,
    ask: "Are the pin's two Meshes in `found`?",
    choices: [
      'Yes: their own visible property is still true',
      'No: nothing under a hidden object is visited',
      'Yes: it skips safety itself, not its children',
    ],
    answer: 1,
    why: "`traverseVisible` stops at `safety` and never goes below it, so nothing under it is visited, whatever its own `visible` says. The pin's Meshes do still say `visible = true`; the walk just never reaches them to ask. `traverse` would find them.",
  },
  {
    code: `// the rack: 20 Meshes, all inside its five parts
const meshes = gltf.scene.children.filter((object) => object.isMesh);
console.log(meshes.length);`,
    ask: 'What does it log?',
    choices: ['20', '5', '0'],
    answer: 2,
    why: "`children` is only the first level: the rack's five parts, and none of them is a Mesh. The Meshes are one or two levels further down. `gltf.scene.traverse` reaches them all.",
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
    why: '`traverse` calls the function on `tube` itself first, then on each of its two Meshes. To leave out the object you started from, check `object !== tube` in the function.',
  },
  {
    code: `// knob is a Mesh in pin, pin is in safety, safety is in model,
// and model was added straight to the scene, which has no name
const names = [];
knob.traverseAncestors((object) => names.push(object.name));`,
    ask: 'What does `names` hold?',
    choices: ["`['knob', 'pin', 'safety', 'model', '']`", "`['', 'model', 'safety', 'pin']`", "`['pin', 'safety', 'model', '']`"],
    answer: 2,
    why: "It starts at the parent, not at `knob` itself, and works up, nearest first, all the way to the scene, whose name is the empty string. If you need `knob` too, handle it before the walk.",
  },
  {
    code: `renderer.setAnimationLoop(() => {
  scene.traverse((object) => {
    if (object.userData.spins) object.rotation.y += 0.01;
  });
  renderer.render(scene, camera);
});`,
    ask: "The scene holds 20,000 objects, and 3 of them spin. What's wrong?",
    choices: [
      'It walks all 20,000 objects every frame to turn just 3 of them',
      "Nothing, since traverse skips objects that haven't changed",
      "It throws, because objects can't change inside traverse",
    ],
    answer: 0,
    why: "It works, but it spends CPU time every frame on the whole scene to find the same three objects. Collect them once, after loading, and loop over that list in the frame loop. Changing an object's properties inside `traverse` is fine; adding or removing objects is what breaks it.",
  },
];
