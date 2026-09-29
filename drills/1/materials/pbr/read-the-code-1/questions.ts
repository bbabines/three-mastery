// Read-the-code questions for the PBR metal and roughness page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const gold = new MeshStandardMaterial({ color: '#d4a84a', metalness: 1, roughness: 0.1 });
scene.environment = studioEnvironment; // a white-lit studio`,
    ask: 'What color are the reflections of the studio in it?',
    choices: ['White, like the shine on a plastic', 'Gold, since a metal tints what it reflects', 'None, since a metal shows only diffuse gold'],
    answer: 1,
    why: "A metal has no diffuse color; all you see is reflection, and a metal's color tints it. A non-metal is the other way round: its own color underneath, with faint, colorless reflections on top.",
  },
  {
    code: `const part = new MeshStandardMaterial({ color: '#c0c4c8', metalness: 1 });
part.roughness = 0.05; // then later: part.roughness = 0.9;`,
    ask: 'How do the reflections change between the two values?',
    choices: ['From sharp and mirror-like to blurred into a sheen', 'From dim to bright, with the same sharpness', 'From metal to non-metal, losing the tint'],
    answer: 0,
    why: "Roughness sets how blurry reflections and highlights are, from a mirror at 0 to a soft sheen at 1. It doesn't change whether the surface is a metal; that's `metalness`.",
  },
  {
    code: `// "brushed steel that's partly metal"
const finish = new MeshStandardMaterial({ color: '#c0c4c8', metalness: 0.5, roughness: 0.4 });`,
    ask: 'What does metalness 0.5 give you?',
    choices: ['A milky blend that matches no real material', 'A realistic semi-metal, halfway to steel', 'Exactly the same look as metalness 1'],
    answer: 0,
    why: 'Real surfaces are metal or not, so metalness is 0 or 1. In-between values are for texture pixels where the two meet, like chipped paint. A whole surface at 0.5 mixes both recipes and usually looks milky and plasticky. For brushed steel use `metalness: 1`, and `MeshPhysicalMaterial`\'s `anisotropy` for the stretched highlights.',
  },
  {
    code: `const steel = new MeshStandardMaterial({ color: 'silver' });`,
    ask: 'How does this "steel" look in a well-lit studio?',
    choices: ['Like polished steel, with sharp reflections', 'Like matte gray paint, with no metal at all', 'Black, since it has no environment to reflect'],
    answer: 1,
    why: "The defaults are `metalness: 0` and `roughness: 1`: a fully matte non-metal. The color alone doesn't make it metal. Add `metalness: 1` and a lower `roughness`, such as 0.3.",
  },
  {
    code: `const chrome = new MeshStandardMaterial({ color: 'white', metalness: 1, roughness: 0.05 });
scene.add(new AmbientLight(0xffffff, 3)); // the scene's only light`,
    ask: 'How does the chrome part look?',
    choices: ['Evenly bright white, all over', 'Gray, like brushed aluminum', 'Black, or very nearly black'],
    answer: 2,
    why: "Ambient light only feeds the diffuse part, and a metal has none. With no environment to reflect and no light to make a highlight, the chrome has nothing to show. Give it `scene.environment` (the environment maps page).",
  },
];
