// Drill viewer: renders a drill's README as a page, mounting its scenes and quiz where the README
// places them with <div data-scene="name"> and <div data-quiz>. Elective items (in /electives) are
// pages too; theirs can also place a scored exercise (<div data-exercise>), an effect build's
// viewer (<div data-effect>), and a "Mark done" button (<div data-mark-done>).
import { marked } from 'marked';
import { parse } from 'yaml';
import { DOMAINS, MODE_LABELS } from '../scripts/lib/domains';
import type { EffectSetup, MaskExercise } from './exercise';
import { renderNav, renderPace } from './nav';
import { renderQuiz, type Question } from './quiz';
import { createHarness, type SceneSetup } from './scene';
import type { TslSceneSetup } from './tsl';

interface DrillMeta {
  id: string;
  loop: number;
  mode: string;
  concepts: string[];
  context: string;
  domain?: string; // placement checks name their domain instead of concepts
  // Elective items have these instead of loop, mode, and context.
  elective?: string; // the elective domain's slug, like "vfx"
  kind?: 'page' | 'guided' | 'from-memory';
  renderer?: 'webgpu'; // scenes mount on the TSL harness (tsl.ts)
}

interface Drill {
  folder: string;
  meta: DrillMeta;
  title: string;
  body: string;
}

const readmeFiles = import.meta.glob<string>(
  ['/drills/**/README.md', '/cross/**/README.md', '/placement/**/README.md', '/checkpoints/**/README.md', '/electives/**/README.md'],
  { query: '?raw', import: 'default', eager: true },
);
const sceneModules = import.meta.glob<Record<string, SceneSetup>>([
  '/drills/**/scenes.ts',
  '/cross/**/scenes.ts',
  '/placement/**/scenes.ts',
  '/checkpoints/**/scenes.ts',
]);
const questionModules = import.meta.glob<{ questions: Question[] }>([
  '/drills/**/questions.ts',
  '/cross/**/questions.ts',
  '/checkpoints/**/questions.ts',
]);
// Elective pages: TSL scenes and exercises, and each drill.ts with its reference from /solutions.
const electiveSceneModules = import.meta.glob<Record<string, unknown>>('/electives/**/scenes.ts');
const drillModules = import.meta.glob<Record<string, unknown>>(['/electives/**/drill.ts', '/solutions/electives/**/drill.ts']);

// Folder READMEs without frontmatter are notes, not drills.
const drills: Drill[] = Object.entries(readmeFiles).flatMap(([path, text]) => {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return [];
  const title = match[2].match(/^# (.+)$/m)?.[1] ?? path;
  const body = match[2].replace(/^# .+$/m, '');
  const meta = parse(match[1]) as DrillMeta;
  meta.concepts ??= []; // placement checks and checkpoints have none
  return [{ folder: path.slice(1, -'/README.md'.length), meta, title, body }];
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
// `failedParts` names the domains a checkpoint's missed questions came from.
async function logFinished(drill: Drill, score?: { right: number; total: number }, failedParts?: string[]) {
  try {
    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: drill.meta.id, score, failedParts }),
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

// Placement checks and checkpoints are pages too, told apart by their ids.
function checkKind(drill: Drill) {
  if (drill.meta.id.endsWith('.checkpoint')) return 'checkpoint' as const;
  if (drill.meta.id.endsWith('.placement')) return 'placement' as const;
  return undefined;
}

renderNav(
  nav,
  drills.map((drill) => ({
    folder: drill.folder,
    loop: drill.meta.loop,
    elective: drill.meta.elective,
    kind: drill.meta.kind,
    // Effect builds' ids read <elective>.effects.<effect>.<kind>.
    effect: drill.meta.kind === 'page' ? undefined : drill.meta.id.split('.')[2],
    concept: drill.meta.concepts[0] ?? '',
    concepts: drill.meta.concepts,
    mode: drill.meta.mode,
    check: checkKind(drill),
    domain: drill.meta.domain,
    title: drill.title,
    done: finished.has(drill.meta.id),
  })),
  selected,
);
const pace = document.querySelector<HTMLDivElement>('#pace')!;
renderPace(pace, finished);

const KIND_LABELS: Record<string, string> = { page: 'exercise', guided: 'guided build', 'from-memory': 'build from memory' };

function metaLine(drill: Drill) {
  const { elective, kind, loop, mode } = drill.meta;
  const check = checkKind(drill);
  if (check) return `Loop ${loop} · ${check === 'checkpoint' ? 'checkpoint' : 'placement check'}`;
  if (!elective) return `Loop ${loop} · ${MODE_LABELS[mode] ?? mode.replaceAll('-', ' ')}`;
  const domain = DOMAINS.find((item) => item.slug === elective);
  return `Elective · ${domain?.name ?? elective} · ${KIND_LABELS[kind ?? 'page']}`;
}

async function renderDrill(drill: Drill) {
  const title = document.createElement('h1');
  title.textContent = drill.title;
  const meta = document.createElement('p');
  meta.className = 'meta';
  let metaText = metaLine(drill);
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

  // Teach-back is a private, ungraded comparison. Keep the key points hidden until the
  // learner has written an explanation, then record the reveal as completed practice.
  for (const placeholder of content.querySelectorAll<HTMLElement>('[data-teach-back]')) {
    const keyPoints = document.createElement('div');
    keyPoints.className = 'teach-back-points';
    keyPoints.append(...placeholder.childNodes);
    keyPoints.hidden = true;
    const answer = document.createElement('textarea');
    answer.rows = 7;
    answer.setAttribute('aria-label', 'Explain this in five plain sentences');
    answer.placeholder = 'Explain it in five plain sentences before revealing the key points.';
    const reveal = document.createElement('button');
    reveal.type = 'button';
    reveal.textContent = 'Reveal key points';
    const status = document.createElement('p');
    status.setAttribute('role', 'status');
    reveal.addEventListener('click', async () => {
      if (!answer.value.trim()) {
        status.textContent = 'Write your explanation first.';
        answer.focus();
        return;
      }
      keyPoints.hidden = false;
      reveal.disabled = true;
      const at = await logFinished(drill);
      if (at) {
        showDone(at);
        finished.set(drill.meta.id, at);
        status.textContent = 'Compare your answer with the key points. Logged as done.';
      } else status.textContent = "Key points revealed. Couldn't save progress; is the dev server running?";
    });
    placeholder.replaceChildren(answer, reveal, status, keyPoints);
  }

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

  if (drill.meta.elective) {
    const recordDone = (at: string) => {
      showDone(at);
      finished.set(drill.meta.id, at);
      renderPace(pace, finished);
    };
    const backend = await mountElective(drill, content, recordDone);
    if (backend) {
      metaText += ` · ${backend}`;
      const at = finished.get(drill.meta.id);
      if (at) showDone(at);
      else meta.textContent = metaText;
    }
    return;
  }

  const scenePlaceholders = content.querySelectorAll<HTMLElement>('[data-scene]');
  // A code drill's scenes.ts imports Brad's drill.ts, which may not compile mid-edit. Say so in the
  // scene instead of leaving it blank.
  let scenes: Record<string, SceneSetup> | undefined;
  let loadProblem: string | undefined;
  try {
    scenes = scenePlaceholders.length ? await sceneModules[`/${drill.folder}/scenes.ts`]?.() : undefined;
  } catch (error) {
    loadProblem = `The scene couldn't load, often because drill.ts doesn't compile yet: ${error instanceof Error ? error.message : String(error)}`;
  }
  for (const placeholder of scenePlaceholders) {
    const setup = scenes?.[placeholder.dataset.scene ?? ''];
    if (loadProblem) {
      placeholder.textContent = loadProblem;
      continue;
    }
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
    renderQuiz(quizPlaceholder, quiz.questions, async (right, total, missedDomains) => {
      const at = await logFinished(drill, { right, total }, missedDomains.length ? missedDomains : undefined);
      if (!at) return "Couldn't save your progress. Is npm run dev running?";
      showDone(at);
      finished.set(drill.meta.id, at);
      renderPace(pace, finished);
      return 'Logged as done.';
    });
  }
}

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

// Loads a drill.ts module, or reports why it couldn't: Brad's file may not compile yet.
async function loadDrillModule(path: string) {
  const load = drillModules[path];
  if (!load) return { problem: `There's no ${path.slice(1)}.` };
  try {
    return { module: await load() };
  } catch (error) {
    return { problem: `${path.slice(1)} didn't load: ${message(error)}` };
  }
}

// Mounts an elective page's scenes, exercise, effect viewer, and "Mark done" button. The TSL code
// loads only here, so Loop 1 pages never load three/webgpu. Returns the backend the scenes ran on.
async function mountElective(drill: Drill, content: HTMLElement, recordDone: (at: string) => void) {
  const webgpu = drill.meta.renderer === 'webgpu';
  let backend: string | undefined;
  const scenes = await electiveSceneModules[`/${drill.folder}/scenes.ts`]?.();

  const scenePlaceholders = content.querySelectorAll<HTMLElement>('[data-scene]');
  if (scenePlaceholders.length && webgpu) {
    const { createTslHarness } = await import('./tsl');
    for (const placeholder of scenePlaceholders) {
      const setup = scenes?.[placeholder.dataset.scene ?? ''] as TslSceneSetup | undefined;
      if (!setup) {
        placeholder.textContent = `No scene named "${placeholder.dataset.scene}" in scenes.ts.`;
        continue;
      }
      placeholder.className = 'scene';
      const harness = await createTslHarness(placeholder);
      backend = harness.backend;
      setup(harness);
    }
  }

  const exercisePlaceholder = content.querySelector<HTMLElement>('[data-exercise]');
  if (exercisePlaceholder) {
    const exercise = scenes?.exercise as MaskExercise<unknown> | undefined;
    const yours = await loadDrillModule(`/${drill.folder}/drill.ts`);
    const reference = await loadDrillModule(`/solutions/${drill.folder}/drill.ts`);
    if (!exercise) exercisePlaceholder.textContent = "This page's scenes.ts doesn't export an exercise.";
    else if (!yours.module || !reference.module) exercisePlaceholder.textContent = yours.problem ?? reference.problem ?? '';
    else {
      const { mountMaskExercise } = await import('./exercise');
      const selfCheck = new URLSearchParams(location.search).get('vfx-check') === '1';
      backend = await mountMaskExercise(exercisePlaceholder, exercise, { yours: selfCheck ? reference.module : yours.module, reference: reference.module }, async () => {
        if (selfCheck) return 'Reference self-check; progress not logged.';
        // Logged once: a solved drill.ts stays solved, so reopening the page adds nothing.
        const doneAt = finished.get(drill.meta.id);
        if (doneAt) return `Done ${formatDate(doneAt)}.`;
        const at = await logFinished(drill);
        if (!at) return "Couldn't save your progress. Is npm run dev running?";
        recordDone(at);
        return 'Logged as done.';
      });
    }
  }

  const effectPlaceholder = content.querySelector<HTMLElement>('[data-effect]');
  if (effectPlaceholder) {
    const yours = await loadDrillModule(`/${drill.folder}/drill.ts`);
    const reference = await loadDrillModule(`/solutions/${drill.folder}/drill.ts`);
    effectPlaceholder.className = 'scene effect';
    const { mountEffect } = await import('./exercise');
    backend = await mountEffect(effectPlaceholder, {
      yours: yours.module?.effect as EffectSetup | undefined,
      reference: reference.module?.effect as EffectSetup | undefined,
      hook: effectPlaceholder.dataset.effect || 'your hook',
    });
    if (yours.problem) {
      const problem = document.createElement('p');
      problem.className = 'problem';
      problem.textContent = yours.problem;
      effectPlaceholder.after(problem);
    }
  }

  for (const placeholder of content.querySelectorAll<HTMLElement>('[data-mark-done]')) {
    placeholder.className = 'mark-done';
    const button = document.createElement('button');
    button.textContent = 'Mark done';
    const status = document.createElement('span');
    button.addEventListener('click', async () => {
      button.disabled = true;
      const at = await logFinished(drill);
      button.disabled = false;
      status.textContent = at ? 'Logged as done.' : "Couldn't save your progress. Is npm run dev running?";
      if (at) recordDone(at);
    });
    placeholder.append(button, status);
  }

  return backend;
}

const drill = drills.find((item) => item.folder === selected);
if (drill) {
  renderDrill(drill);
} else {
  article.innerHTML = `<h1>Drill viewer</h1>
    <p>Pick a drill from the list, or run <code>npm run pick</code> for a suggestion.</p>`;
}
