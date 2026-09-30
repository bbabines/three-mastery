// Read-the-code questions for the material override and restore page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `model.traverse((object) => {
  if (object.isMesh) object.material = xray;
});
// later, to turn x-ray off
xray.dispose();`,
    ask: 'How does the model look after the next render?',
    choices: [
      'Back to its own materials: dispose undoes the swap',
      'Still x-ray: every mesh still points at xray',
      "Invisible: a disposed material isn't drawn",
    ],
    answer: 1,
    why: "Nothing remembered the old materials. `dispose()` only frees x-ray's GPU resources, and the meshes still use it, so the next render sets it up again. Save each original before swapping.",
  },
  {
    code: `function highlight(mesh) {
  originals.set(mesh, mesh.material);
  mesh.material = glow;
}
highlight(bolt); highlight(bolt); // the pointer moved, still over the bolt`,
    ask: 'What does `originals.get(bolt)` hold now?',
    choices: [
      "The bolt's own material: a Map keeps the first",
      '`glow`: the second call saved `glow`',
      'Both: a Map keeps a list for each key',
    ],
    answer: 1,
    why: 'By the second call the bolt already wears `glow`, and `set` replaces the value, so restoring changes nothing. Only save when the Map lacks the mesh: `if (!originals.has(mesh))`.',
  },
  {
    code: `scene.overrideMaterial = new MeshNormalMaterial(); // debug view on
// …
scene.overrideMaterial = null;                      // debug view off`,
    ask: "Does each mesh's material need putting back?",
    choices: [
      "No: the meshes' own materials never changed",
      "Yes: the override replaced every mesh's material",
      'Yes: null leaves every mesh with no material',
    ],
    answer: 0,
    why: "`scene.overrideMaterial` never touches `mesh.material`; the renderer draws with it in place of each material. Setting it back to `null` is all it takes.",
  },
];
