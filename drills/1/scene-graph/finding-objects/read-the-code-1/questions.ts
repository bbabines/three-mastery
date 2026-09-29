// Read-the-code questions for the finding objects page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const a = (await loader.loadAsync('rack.glb')).scene;
const b = (await loader.loadAsync('rack.glb')).scene;
scene.add(a, b);
scene.getObjectByName('pin').visible = false;`,
    ask: 'Which pins are hidden?',
    choices: [
      "b's only: the second load renamed a's to pin_1",
      "a's only: the search stops at the first match",
      'Neither: repeated names make it return undefined',
    ],
    answer: 1,
    why: "Each load names its objects on its own, so both copies have a `pin`. The search reaches `a` first and stops there. To hide `b`'s, search inside `b`: `b.getObjectByName('pin')`. To hide both, use `scene.getObjectsByProperty('name', 'pin')`.",
  },
  {
    code: `// In Blender, the part is named "Shelf Top.001"
const shelf = model.getObjectByName('Shelf Top.001');
shelf.visible = false;`,
    ask: 'What happens?',
    choices: [
      "The shelf hides: glTF keeps Blender's names",
      'It throws: the loaded name is really Shelf_Top001',
      'The shelf hides: the search skips spaces and dots',
    ],
    answer: 1,
    why: "GLTFLoader cleaned the name: the space became `_` and the dot was removed, so the object is `Shelf_Top001`. The search found nothing and returned `undefined`, and setting `visible` on `undefined` throws a TypeError. Search for the cleaned name, or compare `userData.name`, which still holds `'Shelf Top.001'`.",
  },
  {
    code: `// the scene has a DirectionalLight and a HemisphereLight
const lights = [];
scene.traverse((object) => {
  if (object.type === 'Light') lights.push(object);
});`,
    ask: 'How many lights end up in `lights`?',
    choices: ['2', '1', '0'],
    answer: 2,
    why: "`type` is the exact class name, `'DirectionalLight'` or `'HemisphereLight'`, never just `'Light'`. Check `object.isLight`, which every kind of light has, or use `scene.getObjectsByProperty('isLight', true)`.",
  },
];
