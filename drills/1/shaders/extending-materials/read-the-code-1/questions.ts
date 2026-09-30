// Read-the-code questions for the extending materials page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// lit by a sun and an environment map
part.material = new MeshStandardMaterial({ metalness: 1, roughness: 0.3 });
part.material.onBeforeCompile = (shader) => {
  shader.fragmentShader = shader.fragmentShader.replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\\ntotalEmissiveRadiance += vec3(0.3, 0.0, 0.0);');
};`,
    ask: 'How does the part look?',
    choices: [
      'Flat red: the patch replaces the lighting code',
      'Lit and reflective: a red glow is added on top',
      "Unchanged: it's only for ShaderMaterial",
    ],
    answer: 1,
    why: '`onBeforeCompile` keeps everything the material already does and adds your line, so the lighting and reflections still run. Only a `ShaderMaterial` starts from nothing.',
  },
  {
    code: `// both parts end up glowing the same color
for (const color of ['red', 'blue']) {
  parts[color].material = new MeshStandardMaterial();
  parts[color].material.onBeforeCompile = (shader) => { shader.fragmentShader = addGlow(shader.fragmentShader, color); };
}`,
    ask: 'Why do both glow the same color?',
    choices: [
      'onBeforeCompile only runs for the first material',
      'Same function text, so they share one program',
      'The second patch overwrites the chunk for all',
    ],
    answer: 1,
    why: "three.js tells patches apart by the function's text, which is the same for both, so the second part reuses the first one's program. Add `material.customProgramCacheKey = () => color;`.",
  },
  {
    code: `// wind sway, patched in after #include <begin_vertex>
// the grass sways, but its shadow on the ground stays still
grass.material.onBeforeCompile = addSway;
grass.castShadow = true;`,
    ask: 'Why does the shadow stay still?',
    choices: [
      'Timing: shadow maps update once, when first drawn',
      'Order: the shadow is drawn before the sway runs',
      'Depth: the shadow pass uses its own material',
    ],
    answer: 2,
    why: 'The shadow pass draws the grass with a built-in depth material, so your sway never runs there. Give `grass.customDepthMaterial` the same `onBeforeCompile` patch.',
  },
];
