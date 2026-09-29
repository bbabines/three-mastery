// Drill viewer: renders a drill's README as a page, mounting its scenes and quiz where the README
// places them with <div data-scene="name"> and <div data-quiz>.
import { marked } from 'marked';
import { parse } from 'yaml';
import { renderNav, renderPace } from './nav';
import { renderQuiz, type Question } from './quiz';
import { createHarness, type SceneSetup } from './scene';

interface DrillMeta {
  id: string;
  loop: number;
  mode: string;
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

interface LogEntry {
  type: string;
  id: string;
  at: string;
  passed?: boolean;
}

// When each drill was last finished, from progress/log.jsonl through the dev server's
// /api/progress (see vite.config.ts). Empty when there's no dev server to ask.
async function loadFinished() {
  try {
    const response = await fetch('/api/progress');
    if (!response.ok) return new Map<string, string>();
    const entries = (await response.json()) as LogEntry[];
    return new Map(entries.filter((entry) => entry.type === 'done' && entry.passed).map((entry) => [entry.id, entry.at]));
  } catch {
    return new Map<string, string>();
  }
}

// Returns when the drill was logged, or undefined if it couldn't be saved.
async function logFinished(drill: Drill, right: number, total: number) {
  try {
    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: drill.meta.id, score: { right, total } }),
    });
    return response.ok ? ((await response.json()) as { at: string }).at : undefined;
  } catch {
    return undefined;
  }
}

const formatDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

const finished = await loadFinished();
const selected = new URLSearchParams(location.search).get('drill');
const nav = document.querySelector<HTMLDivElement>('#drills')!;
const article = document.querySelector<HTMLElement>('#drill')!;

renderNav(
  nav,
  drills.map((drill) => ({
    folder: drill.folder,
    loop: drill.meta.loop,
    concept: drill.meta.concepts[0],
    title: drill.title,
    done: finished.has(drill.meta.id),
  })),
  selected,
);
const pace = document.querySelector<HTMLDivElement>('#pace')!;
renderPace(pace, finished);

async function renderDrill(drill: Drill) {
  const title = document.createElement('h1');
  title.textContent = drill.title;
  const meta = document.createElement('p');
  meta.className = 'meta';
  const metaText = `Loop ${drill.meta.loop} · ${drill.meta.mode.replaceAll('-', ' ')}`;
  meta.textContent = metaText;
  const showDone = (at: string) => {
    meta.innerHTML = `${metaText} · <span class="done">✓ Done ${formatDate(at)}</span>`;
    nav.querySelector('a.drill[aria-current]')?.classList.add('done');
  };
  const doneAt = finished.get(drill.meta.id);
  if (doneAt) showDone(doneAt);
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
  if (quizPlaceholder && quiz) {
    renderQuiz(quizPlaceholder, quiz.questions, async (right, total) => {
      const at = await logFinished(drill, right, total);
      if (!at) return "Couldn't save your progress. Is npm run dev running?";
      showDone(at);
      finished.set(drill.meta.id, at);
      renderPace(pace, finished);
      return 'Logged as done.';
    });
  }
}

const drill = drills.find((item) => item.folder === selected);
if (drill) {
  renderDrill(drill);
} else {
  article.innerHTML = `<h1>Drill viewer</h1>
    <p>Pick a drill from the list, or run <code>npm run pick</code> for a suggestion.</p>`;
}
