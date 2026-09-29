// Read-the-code questions for the decode, upload, compile page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const gltf = await loader.loadAsync('/models/rack.glb');
scene.add(gltf.scene);
// the next frame draws the rack for the first time`,
    ask: 'What does that first frame have to do before it can draw the rack?',
    choices: [
      'Upload its geometry and textures, and compile its shaders',
      'Nothing more, since loading already did the GPU work',
      'Only compile its shaders, since loading uploaded the rest',
    ],
    answer: 0,
    why: "Loading builds the objects in JavaScript memory; the GPU hasn't seen them. The first render that draws the rack copies its geometry and textures to the GPU and compiles a shader program for each new kind of material, all in that one frame.",
  },
  {
    code: `await renderer.compileAsync(gltf.scene, camera, scene);
scene.add(gltf.scene);`,
    ask: "What's left for the first render to do?",
    choices: ['Upload the geometry and the textures', 'Nothing, since the model is fully warmed up', 'Compile the shaders again, for the new scene'],
    answer: 0,
    why: "`compileAsync` compiles shaders only. It uploads no geometry and no textures, so the first render still does both. `renderer.initTexture(texture)` uploads a texture early; geometry uploads on the first render that draws it.",
  },
  {
    code: `await renderer.compileAsync(gltf.scene, camera, scene);
scene.add(new DirectionalLight(0xffffff, 2));
scene.add(gltf.scene);`,
    ask: 'Does the first render compile any shaders?',
    choices: [
      'Yes: the light changes the programs the materials need',
      'No: compileAsync built every shader the model uses',
      "No: a light only changes numbers the shader reads",
    ],
    answer: 0,
    why: "The number of lights is part of every lit material's program, so the shaders `compileAsync` built are for the scene without the new light. The first render compiles again. Add lights and set `scene.environment` before calling `compileAsync`.",
  },
  {
    code: `// switching a product to its "Navy satin" finish, already on screen
finish.color.set('#1e3a8a');
finish.roughness = 0.35;`,
    ask: 'Does the next render compile a new shader program?',
    choices: [
      'No: color and roughness are numbers the shader reads',
      'Yes: any change to a material rebuilds its shader program',
      'Yes: roughness decides which program draws it',
    ],
    answer: 0,
    why: "Color, roughness, metalness, and opacity are uniforms: values handed to the same program each frame. A switch compiles only when it changes the program itself, like a different material type, a new map, `flatShading`, or the number of lights.",
  },
  {
    code: `const swatch = await new TextureLoader().loadAsync('/textures/oak-4k.jpg');
renderer.initTexture(swatch);`,
    ask: 'What does `initTexture` do here?',
    choices: [
      'Copies the image to the GPU now, not on first draw',
      'Attaches the texture to every material that uses it',
      'Compiles the shader program that will sample this texture',
    ],
    answer: 0,
    why: "`loadAsync` already downloaded the image. `initTexture` uploads it to the GPU right away, so the frame that first shows the oak finish doesn't have to. It attaches nothing and compiles nothing: you still set `material.map`, and programs come from materials.",
  },
];
