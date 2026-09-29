// Read-the-code questions for the material override and restore page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `model.traverse((object) => {
  if (object.isMesh) object.material = xray;
});
// later, to turn x-ray off
xray.dispose();`,
    ask: 'What does the model look like after the next render?',
    choices: [
      'Back to its own materials: dispose undoes the swap',
      'Still x-ray: every mesh still points at xray',
      "Invisible: a disposed material isn't drawn",
    ],
    answer: 1,
    why: "Nothing remembered the old materials. `dispose()` only frees the x-ray material's resources on the GPU, and since the meshes still use it, the next render sets it up again. Save each mesh's material before swapping, and put them back to turn x-ray off.",
  },
  {
    code: `function highlight(mesh) {
  originals.set(mesh, mesh.material);
  mesh.material = glow;
}
highlight(bolt);
highlight(bolt); // the pointer moved, still over the bolt
bolt.material = originals.get(bolt);`,
    ask: 'Which material is the bolt wearing now?',
    choices: [
      'Its own material: a Map keeps the first value set',
      '`glow`: the second call saved `glow` as the original',
      'No material: set() fails for a key already there',
    ],
    answer: 1,
    why: "`set` replaces the value for a key that's already in the Map, and by the second call the bolt was already wearing `glow`. So the \"original\" is `glow`, and restoring changes nothing. Only save when the Map doesn't have the mesh yet: `if (!originals.has(mesh))`.",
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
    why: "`scene.overrideMaterial` never touches `mesh.material`; the renderer uses it in place of each material while drawing. Setting it back to `null` is all it takes. It's the one override that works that way, and it applies to everything the scene draws.",
  },
];
