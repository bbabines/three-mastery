// Read-the-code questions for the extending materials page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `part.material = new MeshStandardMaterial({ metalness: 1, roughness: 0.3 });
part.material.onBeforeCompile = (shader) => {
  shader.fragmentShader = shader.fragmentShader.replace('#include <emissivemap_fragment>',
    '#include <emissivemap_fragment>\\ntotalEmissiveRadiance += vec3(0.3, 0.0, 0.0);');
};`,
    ask: 'The scene has a sun and an environment map. How does the part look?',
    choices: [
      'Flat red: the patch replaces the lighting code',
      'Lit and reflective: a red glow is added on top',
      "Unchanged: it's only for ShaderMaterial",
    ],
    answer: 1,
    why: "`onBeforeCompile` keeps everything the material already does and adds one line to it: the lighting, the reflections, and the metalness all still run, and `totalEmissiveRadiance` is the light the surface gives off by itself, added on top. Only a `ShaderMaterial` starts from nothing. `onBeforeCompile` works on any material the WebGL renderer draws.",
  },
  {
    code: `for (const color of ['red', 'blue']) {
  const material = new MeshStandardMaterial();
  material.onBeforeCompile = (shader) => { shader.fragmentShader = addGlow(shader.fragmentShader, color); };
  parts[color].material = material;
}`,
    ask: 'Both parts end up glowing the same color. Why?',
    choices: [
      'onBeforeCompile only runs for the first material made',
      'Same function text, so both share one compiled program',
      'The second patch overwrites the chunk for all materials',
    ],
    answer: 1,
    why: "three.js reuses a compiled program when the settings match, and it tells `onBeforeCompile` patches apart by the function's text. Both functions have the same text; only the `color` they captured differs. Whichever part is drawn first gets its program built, and the other reuses it. Add `material.customProgramCacheKey = () => color;` so each color gets its own.",
  },
  {
    code: `// wind sway, patched in after #include <begin_vertex>
grass.material.onBeforeCompile = addSway;
grass.castShadow = true;`,
    ask: 'The grass sways, but its shadow on the ground stays still. Why?',
    choices: [
      'Timing: shadow maps update once, when first drawn',
      'Order: the shadow is drawn before the sway runs',
      'Depth: the shadow pass uses its own material',
    ],
    answer: 2,
    why: "The shadow pass draws the grass again with a built-in depth material, not with yours, so your sway never runs there and the shadow keeps the unmoved shape. Give the mesh the same patch on its depth material: `grass.customDepthMaterial = new MeshDepthMaterial();` and `grass.customDepthMaterial.onBeforeCompile = addSway;` (`customDistanceMaterial` for a point light).",
  },
];
