// Read-the-code questions for the hover and selection state page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `function highlight(part) { // called on hover, and on click
  if (current) current.material.emissive.set(0x000000);
  current = part;
  if (part) part.material.emissive.set(0x2255ff);
}
// the user clicks the crate, then hovers over the shelf`,
    ask: 'How does the crate look now?',
    choices: ['Still blue, since a click selected it', 'Back to normal, as if never selected', 'Blue, and the shelf stays normal'],
    answer: 1,
    why: 'One variable holds both hover and selection, so hovering the shelf sets the crate back and forgets it. Keep a `hovered` part and a set of `selected` parts.',
  },
  {
    code: `// the part is a screen whose emissive color is green
part.material.emissive.set(0x333333); // on hover
part.material.emissive.set(0x000000); // on leaving`,
    ask: 'How does the screen look afterward?',
    choices: ['Dark, and it stays dark', 'Green again, as it was', 'Gray, left over from the hover'],
    answer: 0,
    why: 'Leaving sets the emissive to black, not to what it was. Save `part.material.emissive.clone()` before the first highlight and copy it back on leaving.',
  },
  {
    code: `// both doors came from one glTF file and share one material
leftDoor.material.emissive.set(0xffaa00); // hover highlight`,
    ask: 'What lights up?',
    choices: ['Only the left door, the one hovered', 'Both doors, and any mesh that shares it', 'Nothing until needsUpdate is set'],
    answer: 1,
    why: "A shared material is one object, so every mesh using it lights up. Give the highlighted part its own material while it's highlighted.",
  },
];
