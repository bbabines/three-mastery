// The Loop 1 checkpoint: two read-the-code questions per domain, in teaching order. The drill viewer
// grades each one on click and, after the last, names the domains that had misses.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    domain: 'math',
    code: `// playerForward has length 1; toCrate doesn't
const toCrate = crate.position.clone().sub(player.position);
const behind = playerForward.dot(toCrate) < 0;`,
    ask: 'Does `toCrate` need normalizing first?',
    choices: ['No: its length can never flip the sign', 'Yes: a dot product needs length-1 inputs', 'Yes: a faraway crate would read as behind'],
    answer: 0,
    why: 'A length only scales the dot product, so the sign still says in front or behind. Normalize before comparing with a number like 0.5, which needs the −1 to 1 scale.',
  },
  {
    domain: 'math',
    code: `const dir = new Vector3(1, 1, 0).normalize();
if (dir.length() === 1) aim(dir);
else throw new Error('not a unit vector');`,
    ask: 'Which line runs, `aim` or the `throw`?',
    choices: ['`aim(dir)`: normalize makes it exactly 1', '`aim(dir)`: `===` ignores tiny rounding', 'The `throw`: the length is a hair under 1'],
    answer: 2,
    why: 'The length comes out as 0.9999999999999999, and `===` has no tolerance. Compare with one instead: `Math.abs(dir.length() - 1) < 1e-6`.',
  },
  {
    domain: 'transforms',
    code: `turntable.rotation.y = Math.PI / 2; // at the origin, a quarter turn
turntable.add(vase);
vase.position.set(2, 0, 0);`,
    ask: 'Where is the vase in the world?',
    choices: ['(2, 0, 0)', '(0, 0, −2)', '(0, 0, 2)'],
    answer: 1,
    why: "The vase's position is measured from the turntable, so the turntable's turn carries it: a quarter turn around Y takes +X to −Z. `vase.getWorldPosition(v)` gives (0, 0, −2).",
  },
  {
    domain: 'transforms',
    code: `// the turret stands at (-5, 0, 0) and isn't turned
const aim = new Vector3(0, 0, -1); // a direction, in the world
turret.worldToLocal(aim);`,
    ask: 'What does `aim` hold now?',
    choices: ['(0, 0, −1)', '(−5, 0, −1)', '(5, 0, −1)'],
    answer: 2,
    why: "`worldToLocal` treats its input as a place and undoes the turret's move, so the direction picks up a shift. Turn a direction with `aim.applyQuaternion(turret.getWorldQuaternion(q).invert())`.",
  },
  {
    domain: 'rotation',
    code: `// the model was made Z-up, so it's stood upright first
model.rotation.x = -Math.PI / 2;
// then, every frame, the turntable spins it:
model.rotation.y += 0.01;`,
    ask: 'Which way does the model turn?',
    choices: ["Around the world's Y, spinning upright", "Around the world's Z, tipping over sideways", "Around the world's X, tipping forward"],
    answer: 1,
    why: "With the default 'XYZ' order, `rotation.y` turns around the model's own Y, which the X turn laid along the world's Z. Set `rotation.order = 'YXZ'`, or spin a parent group.",
  },
  {
    domain: 'rotation',
    code: `// meant as a quarter turn around Y
sign.quaternion.set(0, Math.PI / 2, 0, 1);`,
    ask: 'How does the sign look?',
    choices: ['Turned a quarter turn around Y, as meant', 'Unturned, since a w of 1 means no turn', 'Stretched out of shape, not just turned'],
    answer: 2,
    why: "None of a quaternion's numbers is an angle, and these four aren't length 1, so three.js builds a matrix that stretches about five times as it turns. Set `sign.rotation.y = Math.PI / 2`.",
  },
  {
    domain: 'camera',
    code: `// the label should show only while its spot is in front of the camera
const fromCamera = camera.worldToLocal(spot.clone());
label.hidden = fromCamera.z < 0;`,
    ask: 'When is the label hidden?',
    choices: ['When its spot is in front of the camera', 'When its spot is behind the camera', 'When its spot is off to the side of the view'],
    answer: 0,
    why: 'A camera looks down its own −Z, so measured from the camera, anything in front has a negative z. Hide the label when `fromCamera.z > 0` instead.',
  },
  {
    domain: 'camera',
    code: `// a phone held upright: the canvas is 400 wide and 800 tall
camera.fov = 60;
camera.aspect = 400 / 800;
camera.updateProjectionMatrix();`,
    ask: 'How wide is the view from side to side?',
    choices: ['Exactly 60°', 'About 32°', 'About 120°'],
    answer: 1,
    why: '`fov` is always the angle from bottom to top, and the side-to-side angle follows from the aspect: about 32° on this tall canvas. Check the narrower one when fitting a model.',
  },
  {
    domain: 'geometry',
    code: `const color = geometry.attributes.color; // itemSize 3, every vertex black
for (let i = 0; i < 10; i++) color.array[i] = 1; // "the first 10 vertices white"
color.needsUpdate = true;`,
    ask: 'Which vertices change, and how?',
    choices: ['The first 10, all turned white', 'The first 3 white, and the fourth turned red', 'Only the tenth, vertex 9, turned white'],
    answer: 1,
    why: 'Each vertex takes 3 numbers, so array slots 0 to 9 cover vertices 0 to 2 and the red of vertex 3. Write by vertex number instead: `color.setXYZ(i, 1, 1, 1)`.',
  },
  {
    domain: 'geometry',
    code: `// the left-hand bracket, made from the right-hand one
const left = rightGeometry.clone().scale(-1, 1, 1); // mirrors the vertex data
const bracket = new Mesh(left, material);            // side: FrontSide`,
    ask: 'How does the left bracket draw?',
    choices: ['Inside out, showing the far faces from inside', 'Correctly, as an exact mirror image', 'Correctly, since three.js flips culling'],
    answer: 0,
    why: "Mirroring the vertex data reverses each triangle's corner order, so the fronts face inward. three.js flips culling only for a mirrored object, so mirror the object with `scale.x = -1`, or swap two corners of every triangle.",
  },
  {
    domain: 'assets',
    code: `// oak.jpg: 2048 × 2048 pixels, a 300 KB file
floor.material.map = await new TextureLoader().loadAsync('/textures/oak.jpg');`,
    ask: 'About how much GPU memory does it take?',
    choices: ['About 300 KB, the size of the file', 'About 22 MB, every pixel unpacked', 'About 4 MB, a byte for each pixel'],
    answer: 1,
    why: "The JPG is unpacked to 4 bytes a pixel before it's uploaded, about 16.8 MB, and mipmaps add a third. File size only predicts the download.",
  },
  {
    domain: 'assets',
    code: `// the "Drawer" node's glTF mesh has two primitives: wood and metal
const drawer = gltf.scene.getObjectByName('Drawer');
const hit = raycaster.intersectObject(gltf.scene)[0]; // a click on the wood
if (hit.object === drawer) select(drawer);`,
    ask: 'Does the click select the drawer?',
    choices: ['Yes, since the drawer is the Mesh hit', 'No, since raycasts skip Group children', 'No, since the hit is a Mesh inside the drawer'],
    answer: 2,
    why: 'Two primitives make the drawer a Group with one Mesh per material, and a hit reports the Mesh. Walk up through `hit.object.parent` until you reach the drawer.',
  },
  {
    domain: 'scene-graph',
    code: `// every hook on the pegboard is hook.clone()
function onHover(hovered) {
  hovered.material.emissive.set(0x333333); // light it up
}`,
    ask: 'What lights up when one hook is hovered?',
    choices: ['Every hook on the pegboard', 'Only the hovered hook', 'Nothing until needsUpdate is set'],
    answer: 0,
    why: "A clone shares the original's material, so the change reaches every hook. Swap a highlight material onto the hovered hook, and put its own back when the pointer leaves.",
  },
  {
    domain: 'scene-graph',
    code: `// model is gltf.scene: Groups, with Meshes further down
model.traverse((object) => {
  object.material.wireframe = true; // a quick debug view
});`,
    ask: 'What happens when this runs?',
    choices: ['Every Mesh under the model turns wireframe', "Only the model's direct children turn wireframe", 'It throws at the first object with no material'],
    answer: 2,
    why: '`traverse` visits every object, starting with `model` itself, and a Group has no `material`, so the first line throws a TypeError. Check `if (object.isMesh)` first.',
  },
  {
    domain: 'queries',
    code: `// the page is scrolled down 300 px
const rect = canvas.getBoundingClientRect();
pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
pointer.y = -((event.pageY - rect.top) / rect.height) * 2 + 1;`,
    ask: 'Where does the ray go?',
    choices: ['Below the spot that was clicked', 'Through the spot that was clicked', 'Above the spot that was clicked'],
    answer: 0,
    why: '`pageY` counts from the top of the whole page, but the rect is measured from the top of the window, so the scroll adds 300 px. Use `event.clientY`, as the x line does.',
  },
  {
    domain: 'queries',
    code: `// the table stands at (4, 0, 0) and isn't turned
const hit = raycaster.intersectObject(table)[0];
table.add(pin);
pin.position.copy(hit.point);`,
    ask: 'Where does the pin end up?',
    choices: ["At the table's center, (4, 0, 0)", '4 units along X from the clicked spot', 'On the clicked spot, as intended'],
    answer: 1,
    why: "`hit.point` is in the world, but the pin's `position` is measured from the table, so the table's move is added twice. Use `table.worldToLocal(hit.point.clone())`.",
  },
  {
    domain: 'interaction',
    code: `// on press, hit is the grabbed spot on the drag plane
offset.copy(hit).sub(crate.position);
// on each move:
crate.position.copy(hit).add(offset);`,
    ask: 'What happens on the first move?',
    choices: ['It slides: the grab stays under the pointer', 'It jumps: its origin lands under the pointer', 'It jumps: its origin flips across the pointer'],
    answer: 2,
    why: "The offset runs the wrong way: it should go from the grabbed spot to the origin, `crate.position.clone().sub(hit)`. Backward, it puts the origin as far past the pointer as it started behind.",
  },
  {
    domain: 'interaction',
    code: `let last = 0;
renderer.setAnimationLoop((time) => {
  const delta = time - last; last = time;
  fan.rotation.y += 2 * delta; // meant as 2 radians a second
});`,
    ask: 'How fast does the fan turn?',
    choices: ['About 1,000 times too fast', '2 radians a second, as meant', 'Twice as fast on a 120 Hz screen'],
    answer: 0,
    why: "The loop's `time` counts milliseconds, so `delta` is about 16.7 at 60 Hz, not 0.0167. Use `timer.update(time).getDelta()`, which gives seconds, or divide by 1000.",
  },
  {
    domain: 'gpu',
    code: `crate.material.depthWrite = false; // an opaque crate, in front of a shelf
// where they overlap, the crate is drawn first, then the shelf`,
    ask: 'What shows where the two overlap?',
    choices: ['The crate, since it is nearer the camera', 'The shelf, painted right over the crate', 'Both, the shelf blended over the crate'],
    answer: 1,
    why: "The crate left no depth behind, so the shelf's fragments pass the depth test and paint over it. Leave `depthWrite` on for solid objects.",
  },
  {
    domain: 'gpu',
    code: `console.time('render');
renderer.render(scene, camera);
console.timeEnd('render'); // 1.8 ms, both before and after
// the change: every material swapped for MeshBasicMaterial`,
    ask: 'Did the swap make the frame cheaper?',
    choices: ['No, since the time stayed the same, 1.8 ms', 'Yes, but only the CPU side got cheaper', "Can't tell, since it leaves out the GPU"],
    answer: 2,
    why: "`render()` queues the GPU's work and returns without waiting for it, so the timing is CPU time only. Cheaper materials save GPU work; measure that with a GPU timer or Chrome's Performance panel.",
  },
  {
    domain: 'materials',
    code: `ctx.fillStyle = '#e4572e'; // the brand color
ctx.fillRect(0, 0, 256, 128);
tag.material = new MeshBasicMaterial({ map: new CanvasTexture(ctx.canvas) });`,
    ask: "How does the tag's color compare with the brand's?",
    choices: ['Paler and lighter than the brand color', 'An exact match, since the tag is unlit', 'Darker and more saturated than it'],
    answer: 0,
    why: 'A `CanvasTexture` starts at `NoColorSpace`, so its sRGB numbers are read as linear, then converted again for the screen: #e4572e shows as about #f39e76. Set `colorSpace = SRGBColorSpace`.',
  },
  {
    domain: 'materials',
    code: `// a DirectionalLight shines straight down; there's no other light
panel.material = new MeshLambertMaterial({ color: 'white' });
// the panel is tilted 60° from level`,
    ask: 'Compared with a level panel, how lit is it?',
    choices: ['The same, since the light fills the scene', 'Half as much, since it faces the light less', 'None, since it no longer faces the light'],
    answer: 1,
    why: "Diffuse light follows how squarely a surface faces the light: all of it facing the light, half at 60°, none side-on or facing away. The camera's position plays no part.",
  },
  {
    domain: 'shaders',
    code: `// on new PlaneGeometry(4, 1): one vertex at each corner
// vertex shader
vStripe = step(0.5, fract(uv.x * 10.0));
// fragment shader: gl_FragColor = vec4(vec3(vStripe), 1.0);`,
    ask: 'How many white stripes show on the plane?',
    choices: ['Ten, evenly spaced across it', 'Five, as half the stripes are black', 'None, the whole plane is black'],
    answer: 2,
    why: 'The vertex shader runs only at the four corners, where `uv.x` is 0 or 1, and both give 0. Hand `vUv` over instead and build the stripes in the fragment shader.',
  },
  {
    domain: 'shaders',
    code: `// crate.position.x = 5; its ShaderMaterial's vertex shader:
gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);`,
    ask: 'Where does the crate show up?',
    choices: ["At the world's center, unmoved", 'At x = 5, where it was placed', 'Stuck to the screen, ignoring the camera'],
    answer: 0,
    why: "`position` is measured from the crate itself, and nothing here moves it into the world. Use `projectionMatrix * modelViewMatrix * vec4(position, 1.0)`, which includes the crate's `modelMatrix`.",
  },
  {
    domain: 'debugging',
    code: `const camera = new PerspectiveCamera(50, aspect, 10, 1000);
// the model shows from far away but vanishes as the camera moves in;
// the console is clean`,
    ask: 'Which bucket is the bug in?',
    choices: ['Camera: near cuts off anything within 10', 'Geometry: the model is missing some faces', 'Material: it needs more light to show up close'],
    answer: 0,
    why: 'Anything closer to the camera than `near`, 10 units here, is cut away, so the model vanishes as the camera approaches. Lower `near`, to 0.1 say, and it stays.',
  },
  {
    domain: 'debugging',
    code: `console.log(part.matrixWorld.elements); // rounded:
// [0, 0, -1, 0,  0, 1, 0, 0,  1, 0, 0, 0,  4, 0, 2, 1]`,
    ask: "Which way does the part's own +Z point?",
    choices: ["Along the world's −X", "Along the world's +Z", "Along the world's +X"],
    answer: 2,
    why: '`elements` is stored column by column, so indices 8 to 10 are the third column, the part\'s own +Z: (1, 0, 0). Reading row by row would give −X.',
  },
  {
    domain: 'optimization',
    code: `for (const peg of pegs) { // 600 pegs; the frame is CPU-bound
  const copy = hook.clone(); // shares the geometry and material
  copy.position.copy(peg);
  board.add(copy);
}`,
    ask: 'Which change helps this frame the most?',
    choices: ['A simpler hook with fewer triangles', 'One InstancedMesh holding all 600 hooks', 'A pixel ratio of 1 instead of 2'],
    answer: 1,
    why: 'Each clone is its own draw call, so the CPU submits 600 of them. An InstancedMesh draws every hook in one call; fewer triangles or pixels save GPU work, not CPU time.',
  },
  {
    domain: 'optimization',
    code: `// every frame, for each of 400 parts
if (part.position.clone().sub(target).length() < 1) snap(part);`,
    ask: 'Which rewrite makes no garbage and still works?',
    choices: ['`part.position.distanceTo(target) < 1`', '`part.position.sub(target).length() < 1`', '`part.position.clone().distanceTo(target) < 1`'],
    answer: 0,
    why: "`distanceTo` works with plain numbers and makes nothing. Dropping `clone()` makes nothing too, but `sub` changes the part's own position. Any `clone()` makes a vector per part, every frame.",
  },
];
