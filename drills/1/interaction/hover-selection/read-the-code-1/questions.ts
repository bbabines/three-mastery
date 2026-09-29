// Read-the-code questions for the hover and selection state page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `function highlight(part) {      // called on hover, and on click
  if (current) current.material.emissive.set(0x000000);
  current = part;
  if (part) part.material.emissive.set(0x2255ff);
}`,
    ask: 'The user clicks the crate, then moves the pointer over the shelf. How does the crate look?',
    choices: ['Still blue, since a click selected it', 'Back to normal, as if it was never selected', 'Blue, and the shelf stays normal'],
    answer: 1,
    why: "One variable holds both the hover and the selection, so hovering the shelf replaces the crate: the crate is set back to black and forgotten. Keep a `hovered` part and a set of `selected` parts, and work out each part's look from both.",
  },
  {
    code: `// the part is a screen whose emissive color is green
part.material.emissive.set(0x333333);  // on hover
part.material.emissive.set(0x000000);  // on leaving`,
    ask: 'What does the screen look like after the pointer passes over it?',
    choices: ['Dark, and it stays dark', 'Green again, as it was', 'Gray, left over from the hover'],
    answer: 0,
    why: "Leaving sets the emissive color to black, not to what it was, so the screen's green glow is gone for good. Save the original before the first highlight (`part.userData.baseEmissive = part.material.emissive.clone()`) and copy it back on leaving.",
  },
  {
    code: `// both doors came from one glTF file and share one material
leftDoor.material.emissive.set(0xffaa00); // hover highlight`,
    ask: 'What lights up?',
    choices: ['Only the left door, the one hovered', 'Both doors, and any mesh sharing it', 'Nothing until needsUpdate is set'],
    answer: 1,
    why: 'A shared material is one object, so changing its `emissive` changes every mesh that uses it. Give the highlighted part its own material while it is highlighted, then put the original back; the material override and restore page covers the swap. A color change needs no `needsUpdate`.',
  },
];
