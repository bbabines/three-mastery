// Read-the-code questions for the specular and half vector page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `phone.material = new MeshPhongMaterial({ color: 'black', shininess: 100 });
// a lamp shines on the phone, which stays still; the user orbits the camera around it`,
    ask: 'What does the highlight do?',
    choices: ['It slides across the phone as the camera moves', 'It stays on the same spot of the phone', 'It fades out as the camera moves away from the lamp'],
    answer: 0,
    why: "A highlight is where the normal lines up with the half vector, halfway between the directions to the light and to the viewer. Move the viewer and the half vector turns, so the highlight moves. Only diffuse light stays put.",
  },
  {
    code: `ball.material.shininess = 300; // was 30, the default`,
    ask: 'How does the highlight change?',
    choices: ['It grows larger and softer', 'It gets smaller and sharper', 'It moves toward the light'],
    answer: 1,
    why: "Higher `shininess` narrows how closely the normal has to match the half vector, so the highlight shrinks into a tight, glossy spot. It stays where it was. `MeshStandardMaterial` does the same with a low `roughness`.",
  },
  {
    code: `// a custom shader
vec3 halfVector = toLight + toViewer; // both length 1
float shine = pow(max(dot(normal, halfVector), 0.0), 60.0);`,
    ask: 'What does the highlight look like?',
    choices: ['Correct, since the length of halfVector is ignored', 'Missing, since the dot product is always 0', 'Far too big and bright, a glaring blown-out patch'],
    answer: 2,
    why: 'Adding two length-1 directions gives something up to 2 long, so the dot product can go past 1, and raising it to the 60th power makes it enormous. Normalize it: `normalize(toLight + toViewer)`.',
  },
];
