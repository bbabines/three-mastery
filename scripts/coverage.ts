// Generates COVERAGE.md from drill frontmatter, concept cards, read-the-code questions, placement
// checks, and checkpoints.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import type { Question } from '../harness/quiz';
import { CORE_DOMAINS, CORE_MODES, FIRST_PLACEMENT_LOOP, LIGHT_MODES, LOOPS } from './lib/domains';
import { readLog } from './lib/log';
import { loadCards, loadCheckpoints, loadDrills, loadPlacements, ROOT, type Card, type Drill } from './lib/repo';

interface Check {
  name: string;
  ok: boolean | null; // null: proved by another command
  detail: string;
}

const drills = loadDrills();
// Electives have no loop coverage to track, so their cards (in /concepts/vfx, say) stay out of it.
const coreDomainSlugs = new Set(CORE_DOMAINS.map((domain) => domain.slug));
const cards = loadCards().filter((card) => coreDomainSlugs.has(card.domain));
const placements = loadPlacements();
const checkpoints = loadCheckpoints();
const passedIds = new Set(readLog().flatMap((entry) => (entry.type === 'done' && entry.passed ? [entry.id] : [])));

const questionFiles: { drill: Drill; questions: Question[] }[] = [];
for (const drill of drills) {
  const file = path.join(ROOT, drill.dir, 'questions.ts');
  if (!existsSync(file)) continue;
  const { questions } = (await import(pathToFileURL(file).href)) as { questions: Question[] };
  questionFiles.push({ drill, questions });
}

const TOTAL_CONCEPTS = CORE_DOMAINS.reduce((sum, domain) => sum + domain.concepts.length, 0);
const TOTAL_CORE = CORE_DOMAINS.reduce(
  (sum, domain) => sum + domain.concepts.filter((concept) => concept.tier === 'core').length,
  0,
);
const TOTAL_LIGHT = TOTAL_CONCEPTS - TOTAL_CORE;
const MIN_CONTEXTS = { core: 3, light: 2 };

const drillsFor = (card: Card) => drills.filter((drill) => drill.concepts.includes(card.id));
const contextsUsed = (card: Card) => new Set(drillsFor(card).map((drill) => drill.context));
const requiredModes = (card: Card) => (card.tier === 'core' ? CORE_MODES : LIGHT_MODES);
const missingModes = (card: Card) => {
  const modes = new Set(drillsFor(card).map((drill) => drill.mode));
  return requiredModes(card).filter((mode) => !modes.has(mode));
};
const misconceptionIds = (card: Card) => Object.keys(card.misconceptions).map((key) => `${card.id}/${key}`);
const contextIds = (card: Card) => Object.keys(card.contexts).map((key) => `${card.id}/${key}`);
const list = (items: string[]) => (items.length === 0 ? 'none' : items.join(', '));

function drillOrder(a: Drill, b: Drill) {
  const n = (drill: Drill) => Number(drill.id.split('.').at(-1));
  return a.loop - b.loop || CORE_MODES.indexOf(a.mode) - CORE_MODES.indexOf(b.mode) || n(a) - n(b);
}

// ---- Checks ----

function frontmatterProblems(): string[] {
  const cardsById = new Map(cards.map((card) => [card.id, card]));
  return drills.flatMap((drill) => {
    const drillCards = drill.concepts.map((id) => cardsById.get(id)).filter((card) => card !== undefined);
    const problems = drill.concepts.filter((id) => !cardsById.has(id)).map((id) => `unknown concept ${id}`);
    if (!drillCards.some((card) => contextIds(card).includes(drill.context))) problems.push(`unknown context ${drill.context}`);
    const knownMisconceptions = drillCards.flatMap(misconceptionIds);
    for (const id of drill.misconceptions) {
      if (!knownMisconceptions.includes(id)) problems.push(`unknown misconception ${id}`);
    }
    const [loop, domain] = drill.id.split('.');
    if (Number(loop) !== drill.loop || domain !== drill.domain || !drill.dir.includes(`/${drill.loop}/`)) {
      problems.push('id does not match loop or folder');
    }
    return problems.map((problem) => `${drill.id}: ${problem}`);
  });
}

function consecutiveContextRepeats(): string[] {
  return cards.flatMap((card) => {
    const ordered = drillsFor(card).sort(drillOrder);
    return ordered.slice(1).flatMap((drill, i) => (drill.context === ordered[i].context ? [`${ordered[i].id} → ${drill.id}`] : []));
  });
}

function missingSolutions(): string[] {
  const expected = [
    ...drills.filter((drill) => existsSync(path.join(ROOT, drill.dir, 'drill.ts'))).map((drill) => `${drill.dir}/drill.ts`),
    ...placements.map((placement) => `${placement.dir}/check.ts`),
    ...checkpoints.map((checkpoint) => `${checkpoint.dir}/check.ts`),
  ];
  return expected.filter((file) => !existsSync(path.join(ROOT, 'solutions', file)));
}

// A right answer gives itself away when it's clearly the longest choice, or the only one that
// explains itself. By chance, the right answer is the longest about one time in three.
function answerTells() {
  const all = questionFiles.flatMap(({ drill, questions }) =>
    questions.map((question, index) => ({ id: `${drill.id} #${index + 1}`, question })),
  );
  const longest = all.filter(({ question }) => {
    const lengths = question.choices.map((choice) => choice.length);
    const right = lengths[question.answer];
    return right === Math.max(...lengths) && lengths.filter((length) => length === right).length === 1;
  }).length;
  // Choices share one style: either every choice gives a short reason after a colon, or none does.
  const mixedStyle = all
    .filter(({ question }) => {
      const withReason = question.choices.filter((choice) => choice.includes(': ')).length;
      return withReason > 0 && withReason < question.choices.length;
    })
    .map(({ id }) => id);
  return { total: all.length, longest, mixedStyle };
}

// Domain 1 is the standard for a Loop 1 page's size and voice (writing-pages.md, "Size and voice").
// These are the limits a script can measure, set just above Domain 1's own largest values. Tours
// map a family of classes, so they may run longer and link to more pages.
const LIMITS = {
  inShortWords: 30,
  usedForWords: 22,
  codeLines: 5,
  bLines: 45,
  whyWords: 45,
  pageLines: { light: 85, core: 110, tour: 115 },
  links: 3,
};
const OFF_VOICE: [RegExp, string][] = [
  [/\bBrad\b/, 'names Brad'],
  [/\bLoop [1-4]\b/, 'names a loop'],
  [/\bDomain \d+\b/, 'names a domain by number'],
  [/\br1\d\d\b/, 'names a version'],
  [/\bthis repo\b/i, 'says "this repo"'],
  [/rule of thumb/i, 'says "rule of thumb"'],
  [/\bMDN\b/, 'cites MDN'],
];

const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

function styleProblems(drill: Drill, questions: Question[]): string[] {
  const body = drill.body;
  const tour = /^# Tour:/m.test(body);
  const problems: string[] = [];
  const inShort = body.match(/\*\*In short:\*\* (.*)/)?.[1] ?? '';
  const usedFor = body.match(/\*\*Used for:\*\* (.*)/)?.[1] ?? '';
  if (wordCount(inShort) > LIMITS.inShortWords) problems.push(`In short is ${wordCount(inShort)} words`);
  if (wordCount(usedFor) > LIMITS.usedForWords) problems.push(`Used for is ${wordCount(usedFor)} words`);
  if (usedFor.includes(';')) problems.push('Used for has semicolons');
  // The frontmatter isn't in drill.body; add its lines back to compare with whole-file counts.
  const lines = body.split('\n').length + 10 + drill.misconceptions.length;
  const lineLimit = tour ? LIMITS.pageLines.tour : LIMITS.pageLines[drill.tier];
  if (lines > lineLimit) problems.push(`${lines} lines`);
  const b = body.split('## B · ')[1]?.split('## Drill')[0] ?? '';
  if (b.split('\n').length > LIMITS.bLines) problems.push(`B is ${b.split('\n').length} lines`);
  const longestCode = Math.max(0, ...[...body.matchAll(/```[a-z]*\n([\s\S]*?)```/g)].map((m) => m[1].trimEnd().split('\n').length));
  if (longestCode > LIMITS.codeLines) problems.push(`longest code block ${longestCode} lines`);
  const links = (body.match(/\bthe [^.\n]{2,40}? page\b/gi) ?? []).length;
  if (!tour && links > LIMITS.links) problems.push(`${links} links to other pages`);
  for (const [pattern, label] of OFF_VOICE) if (pattern.test(body)) problems.push(label);
  const longWhys = questions.filter((question) => wordCount(question.why) > LIMITS.whyWords).length;
  if (longWhys) problems.push(`${longWhys} long ${longWhys === 1 ? 'explanation' : 'explanations'}`);
  return problems;
}

function styleReport() {
  return questionFiles
    .filter(({ drill }) => drill.loop === 1)
    .map(({ drill, questions }) => ({ drill, problems: styleProblems(drill, questions) }));
}

function checks(): Check[] {
  const coreDone = cards.filter((card) => card.tier === 'core' && missingModes(card).length === 0).length;
  const lightDone = cards.filter((card) => card.tier === 'light' && missingModes(card).length === 0).length;
  const misconceptions = cards.flatMap(misconceptionIds);
  const exposed = new Set(drills.flatMap((drill) => drill.misconceptions));
  const contextsDone = cards.filter((card) => contextsUsed(card).size >= MIN_CONTEXTS[card.tier]).length;
  const repeats = consecutiveContextRepeats();
  const lensGaps = drills.flatMap((drill) => [
    ...(drill.lenses.includes('space') && !drill.body.includes('## Spaces') ? [`${drill.id} (no Spaces section)`] : []),
    ...(drill.lenses.includes('cost') && !drill.body.includes('## Measure') ? [`${drill.id} (no Measure section)`] : []),
  ]);
  const placementLoops = LOOPS.filter((loop) => loop.n >= FIRST_PLACEMENT_LOOP).map((loop) => loop.n);
  const placementCount = placements.filter((placement) => placementLoops.includes(placement.loop)).length;
  const placementTarget = placementLoops.length * CORE_DOMAINS.length;
  const noSolution = missingSolutions();
  const problems = frontmatterProblems();
  const threeVersion = JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8')).dependencies.three as string;
  const tells = answerTells();
  const style = styleReport();
  const offStyle = style.filter((item) => item.problems.length > 0);
  const offByDomain = [...new Set(offStyle.map((item) => item.drill.domain))].map(
    (domain) => `${domain} ${offStyle.filter((item) => item.drill.domain === domain).length}`,
  );

  return [
    { name: 'Every core concept has a drill in each of the four modes', ok: coreDone === TOTAL_CORE, detail: `${coreDone}/${TOTAL_CORE}` },
    { name: 'Every light concept has read-the-code, apply, and break-and-fix coverage', ok: lightDone === TOTAL_LIGHT, detail: `${lightDone}/${TOTAL_LIGHT}` },
    {
      name: 'Every listed misconception has a drill that exposes it',
      ok: cards.length === TOTAL_CONCEPTS && misconceptions.every((id) => exposed.has(id)),
      detail: `${misconceptions.filter((id) => exposed.has(id)).length}/${misconceptions.length} on the ${cards.length} cards written so far`,
    },
    { name: 'Core drills span ≥3 contexts; light drills span ≥2', ok: contextsDone === TOTAL_CONCEPTS, detail: `${contextsDone}/${TOTAL_CONCEPTS}` },
    { name: 'No two consecutive drills of a concept share a context', ok: repeats.length === 0, detail: list(repeats) },
    { name: 'Space-lens drills state spaces; cost-lens drills measure', ok: lensGaps.length === 0, detail: list(lensGaps) },
    { name: 'Every domain has a placement check in Loops 2–4', ok: placementCount === placementTarget, detail: `${placementCount}/${placementTarget}` },
    { name: 'Every loop has a checkpoint', ok: checkpoints.length === LOOPS.length, detail: `${checkpoints.length}/${LOOPS.length}` },
    { name: 'Starter code fails its acceptance check until solved', ok: null, detail: 'proved by `npm run verify`' },
    { name: 'Solutions live only in /solutions, mirrored', ok: noSolution.length === 0, detail: noSolution.length ? `missing: ${list(noSolution)}` : 'every item has a mirror' },
    {
      name: 'Every drill uses APIs valid for the pinned three.js version',
      ok: /^\d+\.\d+\.\d+$/.test(threeVersion) ? null : false,
      detail: `three ${threeVersion}; proved by \`npm run typecheck\``,
    },
    { name: 'Drill frontmatter matches the concept cards', ok: problems.length === 0, detail: list(problems) },
    {
      name: "Read-the-code answers don't give themselves away",
      ok: tells.longest <= tells.total * 0.4 && tells.mixedStyle.length === 0,
      detail:
        `${tells.longest}/${tells.total} right answers are the longest choice (chance is about 1 in 3)` +
        (tells.mixedStyle.length ? `; choices in mixed styles: ${list(tells.mixedStyle)}` : ''),
    },
    {
      name: "Loop 1 pages keep Domain 1's size and voice",
      ok: offStyle.length === 0,
      detail: offStyle.length
        ? `${offStyle.length}/${style.length} pages over a limit (${offByDomain.join(', ')}); see "Size and voice" below`
        : `all ${style.length} pages`,
    },
  ];
}

function styleTable() {
  const rows = styleReport()
    .filter((item) => item.problems.length > 0)
    .map((item) => [item.drill.id, item.problems.join(', ')]);
  return rows.length ? table(['Page', 'Over the limit'], rows) : 'Every Loop 1 page is within the limits.';
}

// ---- Tables ----

function table(header: string[], rows: string[][]) {
  const line = (cells: string[]) => `| ${cells.join(' | ')} |`;
  return [line(header), line(header.map(() => '---')), ...rows.map(line)].join('\n');
}

const mark = (ok: boolean | null) => (ok === null ? '—' : ok ? '✅' : '❌');

function progressTable() {
  return table(
    ['Loop', 'Drills built', 'Estimate', 'Passed'],
    LOOPS.map((loop) => {
      const built = drills.filter((drill) => drill.loop === loop.n);
      const passed = built.filter((drill) => passedIds.has(drill.id)).length;
      return [`${loop.n}. ${loop.name}`, String(built.length), `~${loop.estimate}`, String(passed)];
    }),
  );
}

function cardsTable() {
  return table(
    ['Domain', 'Cards', 'Concepts'],
    CORE_DOMAINS.map((domain) => {
      const count = cards.filter((card) => card.domain === domain.slug).length;
      return [`${domain.n}. ${domain.name}`, String(count), String(domain.concepts.length)];
    }),
  );
}

function modeTable() {
  const otherModes = [...new Set(drills.map((drill) => drill.mode))].filter((mode) => !CORE_MODES.includes(mode));
  const modes = [...CORE_MODES, ...otherModes];
  return table(
    ['Concept', 'Tier', ...modes],
    cards.map((card) => {
      const cells = modes.map((mode) => {
        const count = drillsFor(card).filter((drill) => drill.mode === mode).length;
        if (count > 0) return String(count);
        return requiredModes(card).includes(mode) ? '✗' : '';
      });
      return [card.id, card.tier, ...cells];
    }),
  );
}

function contextTable() {
  return table(
    ['Concept', 'Used / needed', 'Contexts (× drills)'],
    cards.map((card) => {
      const counts = Object.keys(card.contexts).map((key) => {
        const count = drillsFor(card).filter((drill) => drill.context === `${card.id}/${key}`).length;
        return count > 0 ? `**${key}** ×${count}` : key;
      });
      return [card.id, `${contextsUsed(card).size} / ${MIN_CONTEXTS[card.tier]}`, counts.join(' · ')];
    }),
  );
}

function misconceptionTable() {
  return table(
    ['Misconception', 'Wrong model', 'Drills'],
    cards.flatMap((card) =>
      Object.entries(card.misconceptions).map(([key, text]) => {
        const id = `${card.id}/${key}`;
        const exposing = drills.filter((drill) => drill.misconceptions.includes(id)).map((drill) => drill.id);
        return [id, text, exposing.length ? exposing.join('<br>') : '✗'];
      }),
    ),
  );
}

function loopItemsTable() {
  return table(
    ['Loop', 'Placement checks', 'Checkpoint'],
    LOOPS.map((loop) => {
      const domains = placements.filter((placement) => placement.loop === loop.n).map((placement) => placement.domain);
      const checkpoint = checkpoints.some((item) => item.loop === loop.n);
      const placementText =
        loop.n < FIRST_PLACEMENT_LOOP
          ? 'none (Loop 1 teaches)'
          : `${domains.length}/${CORE_DOMAINS.length}${domains.length ? ` (${domains.join(', ')})` : ''}`;
      return [`${loop.n}. ${loop.name}`, placementText, checkpoint ? '✅' : '✗'];
    }),
  );
}

const markdown = `# Coverage

Generated by \`npm run coverage\` from drill frontmatter, concept cards, placement checks, and checkpoints. Don't edit it by hand.

## Checks

${table(['', 'Check', 'Detail'], checks().map((check) => [mark(check.ok), check.name, check.detail]))}

## Progress per loop

${progressTable()}

## Placement checks and checkpoints

${loopItemsTable()}

## Concept cards

${cardsTable()}

## Concept × mode

✗ marks a mode the concept's tier requires that has no drill yet.

${modeTable()}

## Concept × context

Bold contexts have at least one drill.

${contextTable()}

## Misconception → drill

${misconceptionTable()}

## Size and voice

Loop 1 pages measured against Domain 1's limits (docs/writing-pages.md, "Size and voice"): In short ≤ ${LIMITS.inShortWords} words, Used for ≤ ${LIMITS.usedForWords} words with no semicolons, pages ≤ ${LIMITS.pageLines.light} lines (light), ${LIMITS.pageLines.core} (core) or ${LIMITS.pageLines.tour} (tour), B ≤ ${LIMITS.bLines} lines, code blocks ≤ ${LIMITS.codeLines} lines, ≤ ${LIMITS.links} links to other pages (tours exempt), quiz explanations ≤ ${LIMITS.whyWords} words, and no off-voice phrases (Brad, loop or domain numbers, versions, "this repo", "rule of thumb", MDN).

${styleTable()}
`;

writeFileSync(path.join(ROOT, 'COVERAGE.md'), markdown);
console.log('Wrote COVERAGE.md');
