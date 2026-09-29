// Read-the-code questions for the 3D-to-2D anchoring page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const ndc = plate.getWorldPosition(v).project(camera);
tag.style.left = \`\${(ndc.x + 1) / 2 * canvas.clientWidth}px\`;
tag.style.top = \`\${(1 - ndc.y) / 2 * canvas.clientHeight}px\`;
tag.hidden = Math.abs(ndc.x) > 1 || Math.abs(ndc.y) > 1 || Math.abs(ndc.z) > 1;`,
    ask: "The serial plate is on the product's back, and the camera faces its front. What does the tag do?",
    choices: ['It hides, since the product is in front', 'It fades, since the plate is farther away', 'It shows, right through the product in the way'],
    answer: 2,
    why: "`project` only says where the plate lands on the view, and the checks only catch spots off the view or behind the camera. Nothing here knows the product is in the way. Raycast from the camera toward the plate and hide the tag when something is hit first.",
  },
  {
    code: `const tag = new CSS2DObject(tagElement);
exitSign.add(tag);
// the user walks past the sign, which is now behind the camera
labelRenderer.render(scene, camera);`,
    ask: 'What happens to the tag?',
    choices: ['It hides, since its z is past 1', 'It shows, mirrored to the other side', 'It stays where it was last frame'],
    answer: 0,
    why: "`CSS2DRenderer` projects each label's anchor and hides the label when the projected z is outside −1 to 1, which covers behind the camera and past `far`. Your own `project` code has to make that check itself.",
  },
  {
    code: `rack.add(new CSS2DObject(tagElement)); // the rack stands behind a wall
labelRenderer.render(scene, camera);`,
    ask: 'The wall hides the rack from the camera. What happens to its label?',
    choices: ['It hides, since the wall is in front', 'It shows, drawn on top of the wall anyway', 'It fades, as the rack is out of sight'],
    answer: 1,
    why: "`CSS2DRenderer` knows where the anchor lands on the view and whether it's behind the camera, but not what's in front of it. The label shows over the wall. Raycast toward the anchor and set the label object's `visible = false` when it's blocked.",
  },
  {
    code: `raycaster.set(camera.position, dir); // dir: toward the anchor, length 1
const first = raycaster.intersectObjects(blockers)[0];
label.hidden = !!first && first.distance < camera.position.distanceTo(anchorPos);`,
    ask: "The anchor sits exactly on the product's front face. What does the label do as the view moves?",
    choices: ['It hides at random, blocked by its own face', 'It always shows, since the face is the anchor', 'It always hides, since every ray hits the face'],
    answer: 0,
    why: 'The ray hits the face at almost exactly the anchor\'s distance, and rounding decides which is smaller, so from some views the face "blocks" its own anchor. Lift the anchor a little off the surface, or compare against the distance minus a small amount.',
  },
  {
    code: `renderer.setAnimationLoop(() => {
  placeLabels();          // project each anchor and move its label
  controls.update();      // damping moves the camera
  renderer.render(scene, camera);
});`,
    ask: 'What do the labels do while the view glides?',
    choices: ['They sit exactly on their anchors, every frame', 'They freeze until the glide stops', 'They trail a frame behind their anchors'],
    answer: 2,
    why: "`project` uses the camera's matrices as the last render left them, and the camera moves after the labels are placed. Each label is placed for the previous frame's view, so they swim a little behind while the view moves. Place them after the render, or call `camera.updateMatrixWorld()` after `controls.update()` and place them then.",
  },
];
