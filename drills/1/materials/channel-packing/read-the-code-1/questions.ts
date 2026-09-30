// Read-the-code questions for the channel packing page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `material.roughnessMap = orm;
material.metalnessMap = orm; // the same texture in both slots`,
    ask: 'Which part of `orm` does each map read?',
    choices: ['Both read the red channel', 'Each averages the whole color', 'Roughness green, metalness blue'],
    answer: 2,
    why: "three.js reads roughness from green and metalness from blue, glTF's packing, and `aoMap` from red. One texture carries all three maps.",
  },
  {
    code: `const gltf = await loader.loadAsync('/models/cabinet.glb');
const material = gltf.scene.getObjectByName('Door').material;
console.log(material.roughnessMap === material.metalnessMap);`,
    ask: 'What does it log for a typical glTF model?',
    choices: ['true, since one texture holds both maps', 'false, since each map is its own texture', 'undefined, as glTF has no such maps'],
    answer: 0,
    why: 'glTF stores roughness and metalness in one texture, and `GLTFLoader` puts that same texture in both slots, each reading its own channel.',
  },
  {
    code: `const orm = new TextureLoader().load('/textures/panel-orm.png');
panel.material = new MeshStandardMaterial({ roughnessMap: orm, metalnessMap: orm });
// the blue channel is white where the panel is bare steel`,
    ask: 'Does the bare steel show up as metal?',
    choices: ['Yes, since the metalness map is white there', 'No, since the map is multiplied by 0', 'Yes, but only once the texture has loaded'],
    answer: 1,
    why: 'Each map is multiplied by its material number, and `metalness` defaults to 0, which wipes the map out. Set `metalness: 1`.',
  },
];
