// Read-the-code questions for the specular and half vector page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `phone.material = new MeshPhongMaterial({ color: 'black', shininess: 100 });
// a lamp shines on the still phone; the user orbits the camera`,
    ask: 'What does the highlight do?',
    choices: ['It slides across the phone as the camera moves', 'It stays on the same spot of the phone', 'It fades as the camera moves from the lamp'],
    answer: 0,
    why: 'The highlight is where the normal lines up with the half vector, which turns as the viewer moves. Only diffuse light stays put.',
  },
  {
    code: `ball.material.shininess = 300; // was 30, the default`,
    ask: 'How does the highlight change?',
    choices: ['It grows larger and softer', 'It gets smaller and sharper', 'It moves toward the light'],
    answer: 1,
    why: 'Higher `shininess` narrows how closely the normal must match the half vector, so the highlight shrinks into a tight spot. A low `roughness` does the same.',
  },
  {
    code: `// a custom shader
vec3 halfVector = toLight + toViewer; // both length 1
float shine = pow(max(dot(normal, halfVector), 0.0), 60.0);`,
    ask: 'What does the highlight look like?',
    choices: ['Correct, since its length is ignored', 'Missing, since the dot product is 0', 'Far too big and bright, blown out'],
    answer: 2,
    why: 'The sum can be up to 2 long, so the dot product can go past 1, and the 60th power makes it enormous. Use `normalize(toLight + toViewer)`.',
  },
];
