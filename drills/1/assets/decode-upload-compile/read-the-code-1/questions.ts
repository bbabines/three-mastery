// Read-the-code questions for the decode, upload, compile page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const gltf = await loader.loadAsync('/models/rack.glb');
scene.add(gltf.scene);
// the next frame draws the rack for the first time`,
    ask: 'What must that first frame do first?',
    choices: [
      'Nothing more, since loading did the GPU work',
      'Upload the data and compile the shaders',
      'Only compile, since loading did the upload',
    ],
    answer: 1,
    why: 'Loading builds the objects in JavaScript memory only. The first render that draws the rack uploads its geometry and textures and compiles its shaders, all in one frame.',
  },
  {
    code: `await renderer.compileAsync(gltf.scene, camera, scene);
scene.add(gltf.scene);`,
    ask: "What's left for the first render?",
    choices: ['Compiling the shaders again for the scene', 'Uploading the geometry and textures', 'Nothing, since the model is warmed up'],
    answer: 1,
    why: '`compileAsync` compiles shaders only, so the first render still uploads the geometry and textures. `renderer.initTexture` can upload textures early.',
  },
  {
    code: `await renderer.compileAsync(gltf.scene, camera, scene);
scene.add(new DirectionalLight(0xffffff, 2));
scene.add(gltf.scene);`,
    ask: 'Does the first render compile any shaders?',
    choices: [
      'No: compileAsync built every shader',
      'No: a light only changes shader numbers',
      'Yes: the light changes the programs',
    ],
    answer: 2,
    why: "The number of lights is part of every lit material's program, so the first render compiles again. Add lights and `scene.environment` before `compileAsync`.",
  },
  {
    code: `// switching a finish that's already on screen
finish.color.set('#1e3a8a');
finish.roughness = 0.35;`,
    ask: 'Does the next render compile a new program?',
    choices: [
      'No: both are numbers the shader reads',
      'Yes: any material change rebuilds it',
      'Yes: roughness picks the program',
    ],
    answer: 0,
    why: 'Color and roughness are uniforms, values handed to the same program. Only changes like a new material type, a new map, or more lights compile.',
  },
  {
    code: `const swatch = await new TextureLoader().loadAsync('/textures/oak.jpg');
renderer.initTexture(swatch);`,
    ask: 'What does `initTexture` do here?',
    choices: [
      'Compiles the program that will sample it',
      'Uploads the image to the GPU right away',
      'Attaches it to every material using it',
    ],
    answer: 1,
    why: "It uploads the texture now, so the frame that first shows the oak finish doesn't have to. You still set `material.map` yourself.",
  },
];
