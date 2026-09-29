// Read-the-code questions for the diffuse (Lambert) page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `ball.material = new MeshLambertMaterial({ color: 'white' });
// the sun lights the ball's left side; now walk the camera around to its right
camera.position.set(4, 1, 0);`,
    ask: 'From the new spot, where is the lit side?',
    choices: ['Still on the left, and exactly as bright', 'On the side now facing the camera', 'Still on the left, but a lot dimmer'],
    answer: 0,
    why: "Diffuse light is scattered evenly in every direction, so it depends only on the normal and the direction to the light: `max(dot(normal, toLight), 0)`. The camera isn't in it. Only shine and reflections move with the viewer.",
  },
  {
    code: `// a custom shader
float diffuse = dot(normal, toLight); // both length 1
vec3 color = baseColor * (ambient + diffuse);`,
    ask: 'What happens on the side of the ball facing away from the light?',
    choices: ['It gets just the ambient light, as intended', 'It gets darker than the ambient light alone', 'It gets lit from behind, as if the light were there'],
    answer: 1,
    why: 'Facing away, the dot product is negative, and adding a negative number takes light away from the ambient, down to black. Clamp it: `max(dot(normal, toLight), 0.0)`.',
  },
  {
    code: `// normal: from normalMatrix, so measured from the camera
// toLight: the light's direction in the world
float diffuse = max(dot(normal, toLight), 0.0);`,
    ask: 'What goes wrong?',
    choices: ['The lighting shifts as the camera orbits', 'Nothing, since a dot product ignores spaces', 'The result is 0 everywhere'],
    answer: 0,
    why: "The two directions are in different spaces, so the dot product compares the wrong things. As the camera turns, the view-space normal changes while the world-space light direction doesn't, and the lighting swims. Put both in the same space; three.js's own shaders use view space.",
  },
  {
    code: `const bands = new TextureLoader().load('/textures/three-tone.png'); // 3 pixels wide
ball.material = new MeshToonMaterial({ color: 'orange', gradientMap: bands });`,
    ask: 'What does the ball look like?',
    choices: ['Smooth shading where the bands should be', 'Three crisp, flat bands of shading', 'One flat color with no shading at all'],
    answer: 0,
    why: "A texture from `TextureLoader` blends neighboring pixels (`LinearFilter`), so the three tones blur into a smooth ramp. Set `bands.minFilter = bands.magFilter = NearestFilter` for crisp bands. A `DataTexture` starts with `NearestFilter`.",
  },
];
