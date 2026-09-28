// Loop-aware drill picker and practice log.
//
//   npm run pick                 suggest what to do next
//   npm run pick -- start [id]   start the timer (defaults to the suggestion)
//   npm run pick -- done         run the item's check and log the result
//                                (add --pass for a drill whose check is visual)
//   npm run pick -- status       progress in the current loop
//
// In Loops 2–4, each domain opens with its placement check. Passing it skips that domain's
// drills for the loop. Drills are ranked by how long ago their domain, then their mode, was
// practiced; ties go to the concept's teaching order in lib/domains.ts. A drill waits until
// its concepts' prerequisites are covered in the loop. A loop ends when its checkpoint passes.
// After Loop 4, maintenance rotates drills from every loop, weighted toward stale concepts and
// domains that failed checkpoint parts.
import { existsSync } from 'node:fs';
import path from 'node:path';
import { CORE_DOMAINS, LOOPS, teachingOrder } from './lib/domains';
import { appendLog, readLog, type DoneEntry, type StartEntry } from './lib/log';
import { loadCards, loadCheckpoints, loadDrills, loadPlacements, ROOT, type Drill } from './lib/repo';
import { runVitest } from './lib/vitest';

interface Item {
  kind: 'drill' | 'placement' | 'checkpoint';
  id: string;
  dir: string;
  loop: number;
  minutes: number;
  domain?: string;
  drill?: Drill;
}

const HOURS_IF_NEVER = 10_000;
const HOURS_PER_WEEK = 24 * 7;

const drills = loadDrills();
const cards = new Map(loadCards().map((card) => [card.id, card]));
const coreDomains = new Set(CORE_DOMAINS.map((domain) => domain.slug));

const items: Item[] = [
  ...drills.map((drill): Item => ({ kind: 'drill', ...drill, drill })),
  ...loadPlacements().map((placement): Item => ({ kind: 'placement', ...placement })),
  ...loadCheckpoints().map((checkpoint): Item => ({ kind: 'checkpoint', ...checkpoint })),
];
const itemsById = new Map(items.map((item) => [item.id, item]));

const log = readLog();
const doneEntries = log.filter((entry): entry is DoneEntry => entry.type === 'done');
const passedIds = new Set(doneEntries.filter((entry) => entry.passed).map((entry) => entry.id));

// ---- Loop state ----

function currentLoop(): number | 'maintenance' {
  const open = LOOPS.find((loop) => !passedIds.has(`${loop.n}.checkpoint`));
  return open ? open.n : 'maintenance';
}

// The first attempt counts, so a failed placement can't be retaken until it passes.
function placementResult(loop: number, domain: string) {
  return doneEntries.find((entry) => entry.id === `${loop}.${domain}.placement`);
}

function domainSkipped(loop: number, domain: string) {
  return placementResult(loop, domain)?.passed === true;
}

// A prerequisite is covered in a loop once one of its drills there has passed, its domain's
// placement passed, or it has no drills in that loop at all (a concept whose page isn't built yet).
function conceptCovered(conceptId: string, loop: number) {
  const conceptDrills = drills.filter((drill) => drill.loop === loop && drill.concepts.includes(conceptId));
  if (conceptDrills.length === 0) return true;
  if (domainSkipped(loop, conceptId.split('.')[0])) return true;
  return conceptDrills.some((drill) => passedIds.has(drill.id));
}

function prerequisitesMet(drill: Drill) {
  const prerequisites = drill.concepts.flatMap((id) => cards.get(id)?.prerequisites ?? []);
  return prerequisites.every((id) => conceptCovered(id, drill.loop));
}

// ---- Ranking ----

function hoursSinceLast(match: (item: Item) => boolean) {
  let latest: number | undefined;
  for (const entry of doneEntries) {
    const item = itemsById.get(entry.id);
    if (!item || !match(item)) continue;
    latest = Math.max(latest ?? 0, Date.parse(entry.at));
  }
  return latest === undefined ? HOURS_IF_NEVER : (Date.now() - latest) / 3_600_000;
}

function loopScore(item: Item) {
  const domainHours = hoursSinceLast((other) => other.domain === item.domain);
  const modeHours = item.drill ? hoursSinceLast((other) => other.drill?.mode === item.drill?.mode) : 0;
  return 2 * domainHours + modeHours;
}

function itemOrder(item: Item) {
  return teachingOrder(item.drill?.concepts[0] ?? '');
}

function maintenanceScore(item: Item) {
  const concepts = item.drill?.concepts ?? [];
  const conceptHours = hoursSinceLast((other) => other.drill?.concepts.some((id) => concepts.includes(id)) ?? false);
  const checkpointFailures = doneEntries.filter(
    (entry) => entry.id.endsWith('.checkpoint') && entry.failedParts?.includes(item.domain ?? ''),
  ).length;
  return conceptHours + checkpointFailures * HOURS_PER_WEEK;
}

function loopCandidates(loop: number): Item[] {
  const inLoop = items.filter((item) => item.loop === loop && item.domain && coreDomains.has(item.domain));
  const domains = [...new Set(inLoop.map((item) => item.domain as string))];

  return domains.flatMap((domain) => {
    const placement = inLoop.find((item) => item.kind === 'placement' && item.domain === domain);
    if (placement && !placementResult(loop, domain)) return [placement];
    if (domainSkipped(loop, domain)) return [];
    return inLoop.filter(
      (item) => item.domain === domain && item.drill && !passedIds.has(item.id) && prerequisitesMet(item.drill),
    );
  });
}

function rankedSuggestions(): { items: Item[]; note?: string } {
  const loop = currentLoop();
  if (loop === 'maintenance') {
    const pool = items.filter((item) => item.kind === 'drill');
    return { items: pool.sort((a, b) => maintenanceScore(b) - maintenanceScore(a)) };
  }

  const candidates = loopCandidates(loop);
  if (candidates.length > 0) {
    return {
      items: candidates.sort(
        (a, b) => loopScore(b) - loopScore(a) || itemOrder(a) - itemOrder(b) || a.id.localeCompare(b.id),
      ),
    };
  }

  const checkpoint = itemsById.get(`${loop}.checkpoint`);
  if (checkpoint) return { items: [checkpoint] };
  return { items: [], note: `Every built drill in Loop ${loop} is done. Its checkpoint isn't built yet.` };
}

// ---- Commands ----

function inProgress(): StartEntry | undefined {
  let current: StartEntry | undefined;
  for (const entry of log) {
    if (entry.type === 'start') current = entry;
    else if (entry.id === current?.id) current = undefined;
  }
  return current;
}

function minutesSince(iso: string) {
  return Math.round((Date.now() - Date.parse(iso)) / 6_000) / 10;
}

function describe(item: Item) {
  const label = item.drill ? `${item.drill.mode}, ${item.drill.context.split('/')[1]}` : item.kind;
  return `${item.id}  (${label}, ${item.minutes} min)\n    ${item.dir}/README.md`;
}

function suggest() {
  const current = inProgress();
  if (current) {
    console.log(`In progress: ${current.id}, started ${minutesSince(current.at)} min ago.`);
    console.log('Finish with: npm run pick -- done');
    return;
  }

  const loop = currentLoop();
  console.log(loop === 'maintenance' ? 'Maintenance rotation' : `Loop ${loop}: ${LOOPS[loop - 1].name}`);
  const { items: ranked, note } = rankedSuggestions();
  if (ranked.length === 0) {
    console.log(note ?? 'Nothing to suggest.');
    return;
  }

  console.log(`\nNext:\n  ${describe(ranked[0])}`);
  if (ranked.length > 1) {
    console.log(`\nAlso available:\n${ranked.slice(1, 3).map((item) => `  ${describe(item)}`).join('\n')}`);
  }
  console.log('\nStart it with: npm run pick -- start');
}

function start(id: string | undefined) {
  const item = id ? itemsById.get(id) : rankedSuggestions().items[0];
  if (!item) {
    console.log(id ? `No item with id ${id}.` : 'Nothing to start.');
    process.exitCode = 1;
    return;
  }

  appendLog({ type: 'start', id: item.id, at: new Date().toISOString() });
  console.log(`Started ${item.id}. Timer running.\n`);
  console.log(`  Open:  http://localhost:5173/harness/?drill=${item.dir}  (needs npm run dev)`);
  if (item.kind !== 'drill') {
    console.log(`\nTimed: ${item.minutes} min, no docs.`);
    console.log('When finished: npm run pick -- done');
  } else if (item.drill?.mode === 'read-the-code') {
    console.log('\nWhen finished: npm run pick -- done --pass');
  } else {
    console.log(`  Watch: npm run drill -- ${item.dir}`);
    console.log('\nDocs and three.js source are fine; AI tools and /solutions are not.');
    console.log('When finished: npm run pick -- done');
  }
}

// Drills checked on the page or by eye instead of by a test are confirmed with `done --pass`.
function acceptanceCheckPasses(item: Item, flag: string | undefined) {
  if (!existsSync(path.join(ROOT, item.dir, 'drill.test.ts'))) return flag === '--pass';
  const results = runVitest([item.dir]);
  return results.length > 0 && results.every((result) => result.passed);
}

function finishDrill(item: Item, started: StartEntry, flag: string | undefined) {
  if (!acceptanceCheckPasses(item, flag)) {
    const hint = item.drill?.mode === 'read-the-code' ? ' Finish the page, then run: npm run pick -- done --pass' : '';
    console.log(`\nThe acceptance check still fails. Keep going; the timer is still running.${hint}`);
    process.exitCode = 1;
    return;
  }

  const minutes = minutesSince(started.at);
  appendLog({ type: 'done', id: item.id, at: new Date().toISOString(), minutes, passed: true });
  console.log(`\nLogged ${item.id}: ${minutes} min.`);
}

function finishTimedCheck(item: Item, started: StartEntry) {
  const minutes = minutesSince(started.at);
  const results = runVitest([item.dir]);
  const failedParts = [...new Set(results.flatMap((result) => result.failedSuites))];
  const allPassed = results.length > 0 && results.every((result) => result.passed);
  const inTime = minutes <= item.minutes;
  const passed = allPassed && inTime;
  appendLog({ type: 'done', id: item.id, at: new Date().toISOString(), minutes, passed, failedParts });

  console.log(`\n${item.id}: ${passed ? 'passed' : 'not passed'} in ${minutes} min (limit ${item.minutes}).`);
  if (failedParts.length > 0) console.log(`Missed: ${failedParts.join(', ')}`);
  if (!inTime) console.log('Over the time limit.');
  if (item.kind === 'placement') {
    console.log(passed ? `Skipping ${item.domain} drills for Loop ${item.loop}.` : `Do the ${item.domain} drills for Loop ${item.loop}.`);
  }
}

function done(flag: string | undefined) {
  const started = inProgress();
  const item = started && itemsById.get(started.id);
  if (!started || !item) {
    console.log('Nothing in progress. Start something with: npm run pick -- start');
    process.exitCode = 1;
    return;
  }
  if (item.kind === 'drill') finishDrill(item, started, flag);
  else finishTimedCheck(item, started);
}

function status() {
  const loop = currentLoop();
  if (loop === 'maintenance') {
    console.log(`Maintenance rotation. ${doneEntries.length} completions logged.`);
    return;
  }

  console.log(`Loop ${loop}: ${LOOPS[loop - 1].name}\n`);
  for (const domain of CORE_DOMAINS) {
    const domainDrills = drills.filter((drill) => drill.loop === loop && drill.domain === domain.slug);
    const placement = itemsById.get(`${loop}.${domain.slug}.placement`);
    if (domainDrills.length === 0 && !placement) continue;

    const result = placementResult(loop, domain.slug);
    const placementText = !placement ? 'no placement' : !result ? 'placement not taken' : result.passed ? 'placement passed' : 'placement missed';
    const passed = domainDrills.filter((drill) => passedIds.has(drill.id)).length;
    console.log(`  ${domain.slug.padEnd(14)} ${placementText.padEnd(20)} drills ${passed}/${domainDrills.length}`);
  }

  const checkpoint = itemsById.get(`${loop}.checkpoint`);
  console.log(`\nCheckpoint: ${!checkpoint ? 'not built yet' : passedIds.has(checkpoint.id) ? 'passed' : 'not passed'}`);
}

const [command, argument] = process.argv.slice(2);
if (command === undefined) suggest();
else if (command === 'start') start(argument);
else if (command === 'done') done(argument);
else if (command === 'status') status();
else {
  console.log(`Unknown command: ${command}. Use start, done, or status.`);
  process.exitCode = 1;
}
