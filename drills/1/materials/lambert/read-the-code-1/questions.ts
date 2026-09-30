// Read-the-code questions for the diffuse (Lambert) page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `ball.material = new MeshLambertMaterial({ color: 'white' });
// the sun lights the ball's left side
camera.position.set(4, 1, 0); // now looking from its right`,
    ask: 'Where is the lit side now?',
    choices: ['Still on the left, just as bright', 'On the side now facing the camera', 'Still on the left, but a lot dimmer'],
    answer: 0,
    why: "Diffuse light depends only on the normal and the direction to the light; the camera isn't in it. Only shine and reflections move with the viewer.",
  },
  {
    code: `// a custom shader
float diffuse = dot(normal, toLight); // both length 1
vec3 color = baseColor * (ambient + diffuse);`,
    ask: 'How does the side facing away look?',
    choices: ['Just the ambient light, as intended', 'Darker than the ambient light alone', 'Lit from behind, as if the light were there'],
    answer: 1,
    why: 'Facing away, the dot product is negative, which subtracts from the ambient light. Clamp it: `max(dot(normal, toLight), 0.0)`.',
  },
  {
    code: `// normal: from normalMatrix, so measured from the camera
// toLight: the light's direction in the world
float diffuse = max(dot(normal, toLight), 0.0);`,
    ask: 'What goes wrong?',
    choices: ['The lighting shifts as the camera orbits', 'Nothing, since a dot product ignores spaces', 'The result is 0 everywhere'],
    answer: 0,
    why: "The two directions are in different spaces, so as the camera turns, the normal changes and the light's direction doesn't. Put both in the same space.",
  },
  {
    code: `const bands = new TextureLoader().load('/textures/three-tone.png'); // 3 pixels wide
ball.material = new MeshToonMaterial({ color: 'orange', gradientMap: bands });`,
    ask: 'What does the ball look like?',
    choices: ['Smooth shading where bands should be', 'Three crisp, flat bands of shading', 'One flat color with no shading at all'],
    answer: 0,
    why: 'A texture from `TextureLoader` blends neighboring pixels, so the three tones blur into a ramp. Set `bands.minFilter = bands.magFilter = NearestFilter`.',
  },
];
