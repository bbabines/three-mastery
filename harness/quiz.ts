// Read-the-code quiz: each question locks after the first pick and explains the answer.
import { marked } from 'marked';

export interface Question {
  code: string;
  ask: string;
  choices: string[];
  answer: number; // index into choices
  why: string;
}

const inline = (markdown: string) => marked.parseInline(markdown, { async: false });

function shuffled<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function renderQuiz(container: HTMLElement, questions: Question[]) {
  let answered = 0;
  let right = 0;
  const score = document.createElement('p');
  score.className = 'score';

  questions.forEach((question, index) => {
    const card = document.createElement('div');
    card.className = 'question';
    card.innerHTML = `<p class="number">${index + 1} of ${questions.length}</p>
      <pre><code></code></pre>
      <p class="ask">${inline(question.ask)}</p>
      <div class="choices"></div>
      <p class="why" hidden></p>`;
    card.querySelector('code')!.textContent = question.code;
    const choices = card.querySelector<HTMLDivElement>('.choices')!;
    const why = card.querySelector<HTMLParagraphElement>('.why')!;

    // Shuffled so the right answer's position can't be memorized.
    for (const choiceIndex of shuffled(question.choices.map((_, i) => i))) {
      const button = document.createElement('button');
      button.innerHTML = inline(question.choices[choiceIndex]);
      if (choiceIndex === question.answer) button.dataset.answer = '';
      button.addEventListener('click', () => {
        const correct = choiceIndex === question.answer;
        for (const other of choices.querySelectorAll('button')) other.disabled = true;
        choices.querySelector('[data-answer]')!.classList.add('correct');
        if (!correct) button.classList.add('wrong');

        answered += 1;
        if (correct) right += 1;
        why.innerHTML = `<strong>${correct ? 'Right.' : 'Not quite.'}</strong> ${inline(question.why)}`;
        why.hidden = false;
        if (answered === questions.length) score.textContent = `${right} of ${questions.length} right.`;
      });
      choices.append(button);
    }
    container.append(card);
  });
  container.append(score);
}
