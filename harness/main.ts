// Drill viewer: renders a drill's README as a page, mounting its scenes and quiz where the README
// places them with <div data-scene="name"> and <div data-quiz>.
import { marked } from 'marked';
import { parse } from 'yaml';
import { renderNav } from './nav';
import { renderQuiz, type Question } from './quiz';
import { createHarness, type SceneSetup } from './scene';

interface DrillMeta {
  loop: number;
  mode: string;
  minutes: number;
  concepts: string[];
  context: string;
}

interface Drill {
  folder: string;
  meta: DrillMeta;
  title: string;
  body: string;
}

const readmeFiles = import.meta.glob<string>(['/drills/**/README.md', '/cross/**/README.md'], {
  query: '?raw',
  import: 'default',
  eager: true,
});
const sceneModules = import.meta.glob<Record<string, SceneSetup>>(['/drills/**/scenes.ts', '/cross/**/scenes.ts']);
const questionModules = import.meta.glob<{ questions: Question[] }>(['/drills/**/questions.ts', '/cross/**/questions.ts']);

// Folder READMEs without frontmatter are notes, not drills.
const drills: Drill[] = Object.entries(readmeFiles).flatMap(([path, text]) => {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return [];
  const title = match[2].match(/^# (.+)$/m)?.[1] ?? path;
  const body = match[2].replace(/^# .+$/m, '');
  return [{ folder: path.slice(1, -'/README.md'.length), meta: parse(match[1]) as DrillMeta, title, body }];
});

const selected = new URLSearchParams(location.search).get('drill');
const nav = document.querySelector<HTMLDivElement>('#drills')!;
const article = document.querySelector<HTMLElement>('#drill')!;

renderNav(
  nav,
  drills.map((drill) => ({ folder: drill.folder, loop: drill.meta.loop, concept: drill.meta.concepts[0], title: drill.title })),
  selected,
);

async function renderDrill(drill: Drill) {
  const title = document.createElement('h1');
  title.textContent = drill.title;
  const meta = document.createElement('p');
  meta.className = 'meta';
  meta.textContent = `Loop ${drill.meta.loop} · ${drill.meta.mode.replaceAll('-', ' ')} · about ${drill.meta.minutes} min`;
  const content = document.createElement('div');
  content.innerHTML = marked.parse(drill.body, { async: false });
  article.append(title, meta, content);

  // Each ## section becomes a collapsible panel, so you can close what you're not working on.
  let panel: HTMLDetailsElement | undefined;
  for (const element of [...content.children]) {
    if (element.tagName === 'H2') {
      panel = document.createElement('details');
      panel.className = 'section';
      panel.open = true;
      element.replaceWith(panel);
      const summary = document.createElement('summary');
      summary.append(element);
      panel.append(summary);
    } else if (panel) {
      panel.append(element);
    }
  }

  const scenePlaceholders = content.querySelectorAll<HTMLElement>('[data-scene]');
  const scenes = scenePlaceholders.length ? await sceneModules[`/${drill.folder}/scenes.ts`]?.() : undefined;
  for (const placeholder of scenePlaceholders) {
    const setup = scenes?.[placeholder.dataset.scene ?? ''];
    if (!setup) {
      placeholder.textContent = `No scene named "${placeholder.dataset.scene}" in scenes.ts.`;
      continue;
    }
    placeholder.className = 'scene';
    setup(createHarness(placeholder));
  }

  const quizPlaceholder = content.querySelector<HTMLElement>('[data-quiz]');
  const quiz = quizPlaceholder ? await questionModules[`/${drill.folder}/questions.ts`]?.() : undefined;
  if (quizPlaceholder && quiz) renderQuiz(quizPlaceholder, quiz.questions);
}

const drill = drills.find((item) => item.folder === selected);
if (drill) {
  renderDrill(drill);
} else {
  article.innerHTML = `<h1>Drill viewer</h1>
    <p>Pick a drill from the list, or run <code>npm run pick</code> for a suggestion.</p>`;
}
