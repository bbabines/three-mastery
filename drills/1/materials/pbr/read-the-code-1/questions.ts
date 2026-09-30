// Read-the-code questions for the PBR metal and roughness page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const gold = new MeshStandardMaterial({ color: '#d4a84a', metalness: 1, roughness: 0.1 });
scene.environment = studioEnvironment; // a white-lit studio`,
    ask: "What color are the studio's reflections in it?",
    choices: ['White, like the shine on plastic', 'Gold, since a metal tints its reflections', 'None, since a metal shows only diffuse gold'],
    answer: 1,
    why: "A metal has no diffuse color; all you see is reflection, tinted by the metal's color. A non-metal's reflections are faint and colorless.",
  },
  {
    code: `const part = new MeshStandardMaterial({ color: '#c0c4c8', metalness: 1 });
part.roughness = 0.05; // then later: part.roughness = 0.9;`,
    ask: 'How do the reflections change?',
    choices: ['From sharp and mirror-like to a soft sheen', 'From dim to bright, just as sharp', 'From metal to non-metal, losing the tint'],
    answer: 0,
    why: "Roughness sets how blurry reflections and highlights are, from a mirror at 0 to a soft sheen at 1. Whether it's a metal is `metalness`.",
  },
  {
    code: `// "brushed steel that's partly metal"
const finish = new MeshStandardMaterial({ color: '#c0c4c8', metalness: 0.5, roughness: 0.4 });`,
    ask: 'What does metalness 0.5 give you?',
    choices: ['A milky blend matching no real material', 'A realistic semi-metal, halfway to steel', 'The same look as metalness 1'],
    answer: 0,
    why: "Real surfaces are metal or not, so a whole surface at 0.5 looks milky. For brushed steel use `metalness: 1`, with `MeshPhysicalMaterial`'s `anisotropy` for the highlights.",
  },
  {
    code: `const steel = new MeshStandardMaterial({ color: 'silver' }); // in a well-lit studio`,
    ask: 'How does this "steel" look?',
    choices: ['Like polished steel, with sharp reflections', 'Like matte gray paint, with no metal at all', 'Black, with no environment to reflect'],
    answer: 1,
    why: 'The defaults are `metalness: 0` and `roughness: 1`, a matte non-metal, whatever the color. Add `metalness: 1` and a lower `roughness`.',
  },
  {
    code: `const chrome = new MeshStandardMaterial({ color: 'white', metalness: 1, roughness: 0.05 });
scene.add(new AmbientLight(0xffffff, 3)); // the scene's only light`,
    ask: 'How does the chrome part look?',
    choices: ['Evenly bright white, all over', 'Gray, like brushed aluminum', 'Black, or very nearly black'],
    answer: 2,
    why: 'Ambient light feeds only the diffuse part, and a metal has none, so the chrome has nothing to show. Give it `scene.environment`.',
  },
];
