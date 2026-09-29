// Read-the-code questions for the channel packing page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `material.roughnessMap = orm;
material.metalnessMap = orm; // the same texture in both slots`,
    ask: 'Which part of `orm` does each map read?',
    choices: ['Both read the red channel of the texture', 'Each reads the whole color and averages it', 'Roughness from green, metalness from blue'],
    answer: 2,
    why: "three.js reads roughness from the green channel and metalness from the blue, glTF's packing, and ambient occlusion (`aoMap`) from red. One texture carries all three maps, one per channel.",
  },
  {
    code: `const gltf = await loader.loadAsync('/models/cabinet.glb');
const material = gltf.scene.getObjectByName('Door').material;
console.log(material.roughnessMap === material.metalnessMap);`,
    ask: 'What does it log for a typical glTF model?',
    choices: ['true, since one texture holds both maps', 'false, since each map is its own texture', 'undefined, as glTF has no such maps'],
    answer: 0,
    why: 'glTF stores roughness and metalness in one texture, and `GLTFLoader` puts that same texture object in both slots. Each slot reads its own channel, so nothing is duplicated in memory.',
  },
  {
    code: `const orm = new TextureLoader().load('/textures/panel-orm.png');
panel.material = new MeshStandardMaterial({ roughnessMap: orm, metalnessMap: orm });
// the blue channel is white where the panel is bare steel`,
    ask: 'Does the bare steel show up as metal?',
    choices: ['Yes, since the metalness map is white there', 'No, since the map is multiplied by metalness 0', 'Yes, but only after the texture has loaded'],
    answer: 1,
    why: "Each map is multiplied by its material number, and `metalness` defaults to 0, so the metalness map is wiped out. Set `metalness: 1` (and keep `roughness` at its default, 1). `GLTFLoader` sets both from the file.",
  },
];
